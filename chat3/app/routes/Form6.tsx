// app/routes/todo.tsx
import { json, type ActionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";
import React from 'react';
import { useState , useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
//
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  FilterFn,
  GlobalFilterFn,
} from "@tanstack/react-table";
import { ArrowUpDown, Plus, Pencil, Trash2, Search } from 'lucide-react';
import Head from '../components/Head';
import CrudIndex from "./Form6/CrudIndex";
//import LibConfig from "@/lib/LibConfig"

// Zodスキーマの定義
const todoSchema = z.object({
  title: z.string().min(2, "タイトルは2文字以上で入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  public: z.enum(["public", "private"]),
  food_orange: z.boolean().optional(),
  food_apple: z.boolean().optional(),
  food_banana: z.boolean().optional(),
  pub_date: z.string(),
  qty1: z.string().min(1, "数量1を入力してください"),
  qty2: z.string().min(1, "数量2を入力してください"),
  qty3: z.string().min(1, "数量3を入力してください"),
});
type TodoSchema = z.infer<typeof todoSchema>;
interface Todo extends TodoSchema {
  id: number;
}
const initialFormData = {
  title: '',
  content: '',
  public: 'public',
  food_orange: true,
  food_apple: true,
  food_banana: true,
  pub_date: '',
  qty1: '0',
  qty2: '0',
  qty3: '0',
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  const resulte = await CrudIndex.getList();
//console.log(resulte);
  return json({ data: resulte });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const todoId = formData.get("todo_id");
  console.log("action=", action);

  if (action === "create" || action === "edit") {
    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
      public: formData.get("public"),
      food_orange: formData.get("food_orange") === "on",
      food_apple: formData.get("food_apple") === "on",
      food_banana: formData.get("food_banana") === "on",
      pub_date: formData.get("pub_date"),
      qty1: formData.get("qty1"),
      qty2: formData.get("qty2"),
      qty3: formData.get("qty3"),
    };
    const retObj = {ret: 500, message : "", data: {} }
    const url = process.env.VITE_API_URI;
    try {
      const validated = todoSchema.parse(data);
      // ここでデータベースへの保存処理を行う
      if (action === "create") {
//console.log("url=", url); 
        const result = await CrudIndex.addItem(data);
console.log(result)
        return json({ success: true , action: "create", data: data, });
      }else{
        data.id = Number(todoId);
        const result = await CrudIndex.update(data, Number(todoId));
        console.log(result)
        return json({
          success: true, action: "edit", data: data, id: Number(todoId) 
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (error instanceof z.ZodError) {
          const validationErrors: ValidationErrors = {};
          error.errors.forEach((err) => {
            const path = err.path[0] as string;
            if (!validationErrors[path]) {
              validationErrors[path] = [];
            }
            validationErrors[path].push(err.message);
          });
          return json({ errors: validationErrors , data : data },
            { status: 400 }
          );
        }
      }
      return json({ error: "不明なエラーが発生しました" }, { status: 500 });
    }

  }

  if (action === "delete") {
    const id = formData.get("id");
    const result = await CrudIndex.delete(Number(id));
    console.log(result);
    return json({ success: true, action: "delete", id: Number(id), });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};
const LOCAL_STORAGE_KEY = "remix51_form4";
const saveStorage = function(items: any){
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
}
// グローバル検索フィルター関数
const fuzzyFilter: GlobalFilterFn<any> = (row, columnId, value, addMeta) => {
  const itemValue = row.getValue(columnId);
  if (itemValue == null) return false;
  
  const searchValue = value.toLowerCase();
  const itemString = String(itemValue).toLowerCase();
  
  return itemString.includes(searchValue);
};
//
export default function TodoPage() {
  const { data } = useLoaderData<typeof loader>();
  //console.log(data);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState<Todo>(initialFormData);
  //
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  useEffect(() => {
    setTodos(data);
  }, []);

  useEffect(() => {
    if(actionData){
      console.log(actionData);
      //console.log(actionData?.errors);
      if(actionData?.errors){
        setFormData(actionData?.data);
        setErrors(actionData?.errors);
        console.log(actionData?.errors);
      }
      if(actionData.success){
        if(actionData.action && actionData.action === "create"){
          console.log("#success.create");
          const newEntry = actionData.data;
          newEntry.id = Date.now();
          const target = todos;
          target.push(newEntry);
          setTodos(target);
          saveStorage(target);
          location.reload();
        }
        if(actionData.action && actionData.action === "delete"){
          console.log("id=", Number(actionData.id) );
          location.reload();
        }
        if(actionData.action && actionData.action === "edit"){
          console.log("action.edit.id=", Number(actionData.id) );
          //console.log("text=", todoText);
          location.reload();
        }
        setCurrentTodo(null);
        setIsOpen(false);
      }
    }
  }, [actionData]);
  //
  // カラム定義
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      //header: "ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const title = row.getValue("title");
        return <div className="font-medium">{title}</div>
      },
    },   
    {
      accessorKey: "action",
      header: ({ column }) => {
        return (<div className="text-center font-medium">Action</div>)
      },
      cell: ({ row }) => {
        const  payment= row.original;
        //flex gap-2 
        return (
        <div className="text-end">
          <Button variant="outline"
            onClick={() => {
              handleEdit(payment);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>          
          <Button className="mx-2"
            variant="destructive" size="icon"
            onClick={() => {
              console.log("id=", payment.id);
              const confirmed = window.confirm('削除してもよろしいですか？');
              if (confirmed) {
                const formData = new FormData();
                formData.append("_action", "delete");
                formData.append("id", payment.id);
                submit(formData, { method: "post" });
              }
              //handleDelete(payment.id);
            }}
          ><Trash2 className="h-4 w-4" />
          </Button>
        </div>
        )
      },
    },
  ];
  //
  const table = useReactTable({
    data: todos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
  });

  const handleDelete = (id: number): void => {
    const confirmed = window.confirm('このTODOを削除してもよろしいですか？');
    if (confirmed) {
      const target = todos.filter(todo => todo.id !== id);
      setTodos(target);
      saveStorage(target);
    }
  };

  const handleEdit = (todo: Todo) => {
    //console.log(todo);
    setErrors({});
    setCurrentTodo(todo);
    setFormData(todo);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentTodo(null);
    setErrors({});
  };

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //
  const TodoForm = ({ todo = null, action = null  }) => (
    <form method="post" onSubmit={(e) => {
      e.preventDefault();
      const sendFormData = new FormData(e.currentTarget);
      submit(sendFormData, { method: "post" });
    }}>
      <input type="hidden" name="_action" value={currentTodo ? "edit" : "create"} />
      {currentTodo ? (
        <input type="hidden" name="todo_id" value={formData.id} />
      ) :null}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            name="title"
            defaultValue={formData?.title}
          />
        </div>
        {errors?.title && (
          <div className="text-red-400">{errors?.title[0]}</div>
        )}

        <div>
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            name="content"
            defaultValue={formData?.content}
          />
        </div>
        {errors?.content && (
          <div className="text-red-400">{errors?.content[0]}</div>
        )}
        <div>
          <Label>公開設定</Label>
          <RadioGroup defaultValue={formData?.public}
           name="public">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public">公開</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">非公開</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>フルーツ選択</Label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="food_orange" name="food_orange" 
              defaultChecked={formData?.food_orange} />
              <Label htmlFor="food_orange">オレンジ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="food_apple" name="food_apple" 
              defaultChecked={formData?.food_apple} />
              <Label htmlFor="food_apple">りんご</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="food_banana" name="food_banana" 
              defaultChecked={formData?.food_banana} />
              <Label htmlFor="food_banana">バナナ</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="pub_date">公開日</Label>
          <Input
            type="date"
            id="pub_date"
            name="pub_date"
            defaultValue={formData?.pub_date}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <Label htmlFor={`qty${num}`}>数量{num}</Label>
              {formData ? (
                <Input
                id={`qty${num}`} name={`qty${num}`}
                defaultValue={formData?.[`qty${num}`]}
                />
              ) : (
                <Input
                id={`qty${num}`} name={`qty${num}`}
                defaultValue={0}
                />
              )}
            {errors?.[`qty${num}`] && (
              <div className="text-red-400">{errors?.[`qty${num}`]}
              </div>
            )}
            </div>

          ))}
        </div>

        <Button type="submit">
          {currentTodo ? "更新" : "追加"}
        </Button>
      </div>
    </form>
  );

  return (
  <>
    <Head />
    <div className="p-4">
      <h1 className="text-4xl font-bold">Form6</h1>
      <div className="my-2 px-2 justify-between text-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>新規追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentTodo ? "Edit" : "Create"}
              </DialogTitle>
            </DialogHeader>
            <TodoForm />
          </DialogContent>
        </Dialog>
      </div>
      {/* グローバル検索 */}
      <div className="flex-1 flex items-center gap-x-2 mb-4">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  </>

  );
}
