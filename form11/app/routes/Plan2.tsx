import React, { useState , useEffect } from 'react';
import { json, type ActionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { requireUserSession, logout } from "@/utils/auth.server";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import Head from '../components/Head';
import CrudIndex from "./Plan2/CrudIndex";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  const resulte = await CrudIndex.getList();
//console.log(resulte);
  return json({ data: resulte });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  const action = formData.get("_action");
  console.log("action=", action);

  if (action === "create" || action === "edit") {
    try {
      if (action === "create") {
        const result = await CrudIndex.addItem(data);
        console.log(result)

        return json({ success: true , action: "create", data: data, });
      }else{
        console.log("edit.id=", data.id);
        const result = await CrudIndex.update(data, Number(data.id));
        console.log(result)
        return json({
          success: true, action: "edit", data: data, id: 0 
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
      console.log(error);
      return json({ error: "不明なエラーが発生しました" }, { status: 500 });
    }
  }
  if (action === "delete") {
    const id = formData.get("id");
    console.log("#action.delete.id", id);
    const result = await CrudIndex.delete(Number(id));
    console.log(result);
    return json({ success: true, action: "delete", id: 0, });
  }
  return json({ error: "Invalid action" }, { status: 400 });
};
//
const ScheduleCalendar = () => {
  const submit = useSubmit();
  const { data } = useLoaderData<typeof loader>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    content: '',
    time_1: '', content_1: '',
    time_2: '', content_2: '',
    time_3: '', content_3: '',
    time_4: '', content_4: '',
    time_5: '', content_5: ''
  });
  useEffect(() => {
    console.log(data);
    const target = {};
    data.forEach((row: any) => {
      target[row.date] = row;
    });
    //console.log(target);
    setSchedules(target);
  }, []);

  // カレンダーの日付を生成
  const generateCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const result = [];
    const firstDayOfWeek = firstDay.getDay();
    
    // 前月の日付を追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, month, -i);
      result.unshift({
        date: prevDate,
        isCurrentMonth: false
      });
    }
    
    // 当月の日付を追加
    for (let i = 1; i <= lastDay.getDate(); i++) {
      result.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // 次月の日付を追加
    const remainingDays = 42 - result.length;
    for (let i = 1; i <= remainingDays; i++) {
      result.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return result;
  };

  // 月を変更
  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  // 日付を選択してダイアログを開く
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    console.log("handleDateSelect.dateStr=", dateStr);
    if (schedules[dateStr]) {
      setFormData(schedules[dateStr]);
    } else {
      setFormData({
        date: dateStr,
        content: '',
        time_1: '', content_1: '',
        time_2: '', content_2: '',
        time_3: '', content_3: '',
        time_4: '', content_4: '',
        time_5: '', content_5: ''
      });
    }
    setIsDialogOpen(true);
  };

  // フォームの送信
  const handleSubmit = (e) => {
    e.preventDefault();
    const dateStr = formData.date;
console.log("dateStr=", dateStr);
    //
    if(!schedules[dateStr]) {
      const sendFormData = new FormData(e.currentTarget);
      sendFormData.append("_action", "create");
      sendFormData.append("date", dateStr);
      submit(sendFormData, { method: "post" });
    }else{
      const target = schedules[dateStr];
      //console.log(target);
      const sendFormData = new FormData(e.currentTarget);
      sendFormData.append("_action", "edit");
      sendFormData.append("date", dateStr);
      sendFormData.append("id", target.id );
      submit(sendFormData, { method: "post" });
    }

    setSchedules(prev => ({
      ...prev,
      [dateStr]: formData
    }));


    setIsDialogOpen(false);
  };

  // スケジュールの削除
  const handleDelete = () => {
    if (!selectedDate) return;
    const confirmed = window.confirm('Delete OK ？'); 
    if (!confirmed) { return; }
    const dateStr = selectedDate.toISOString().split('T')[0];
    const newSchedules = { ...schedules };
    //
    const target = newSchedules[dateStr];
    console.log("#handleDelete");
    console.log(target);
    const sendFormData = new FormData();
    sendFormData.append("_action", "delete");
    sendFormData.append("date", dateStr);
    sendFormData.append("id", target.id);
    submit(sendFormData, { method: "post" });
    //
    delete newSchedules[dateStr];
    setSchedules(newSchedules);
    setIsDialogOpen(false);
    setSelectedDate(null);
  };

  return (
  <>
    <Head />
    <div className="max-w-6xl mx-auto p-4">
    <h1 className="text-4xl font-bold">Plan2</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => changeMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
            </h2>
            <Button variant="outline" onClick={() => changeMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
              <div
                key={day}
                className={`p-2 text-center font-medium ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : ''
                }`}
              >
                {day}
              </div>
            ))}

            {generateCalendarDates().map((item, index) => {
              const dateStr = item.date.toISOString().split('T')[0];
              const hasSchedule = schedules[dateStr];
              return (
                <div
                  key={index}
                  className={`relative p-2 border min-h-24 cursor-pointer hover:bg-gray-50 ${
                    item.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  }`}
                  onClick={() => handleDateSelect(item.date)}
                >
                  <div
                    className={`text-right ${
                      item.date.getDay() === 0
                        ? 'text-red-500'
                        : item.date.getDay() === 6
                        ? 'text-blue-500'
                        : ''
                    }`}
                  >
                    {item.date.getDate()}
                  </div>
                  {hasSchedule && (
                    <div className="mt-1 text-xs bg-blue-100 p-1 rounded">
                      {hasSchedule.content}
                    </div>
                  )}
                  {item.isCurrentMonth && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-1 right-1 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateSelect(item.date);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && selectedDate.toLocaleDateString('ja-JP')} の予定
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/*
            <input tye="text" name="date" 
            value={selectedDate && selectedDate.toLocaleDateString('ja-JP')} />
            */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">内容</label>
                <Textarea
                  placeholder="予定の内容を入力"
                  value={formData.content}
                  name="content"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                />
              </div>

              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="space-y-2">
                  <label className="text-sm font-medium">予定 {num}</label>
                  <div className="flex space-x-2">
                    <Input
                      type="time"
                      name={`time_${num}`}
                      value={formData[`time_${num}`]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [`time_${num}`]: e.target.value
                        }))
                      }
                      className="w-32"
                    />
                    <Textarea
                      placeholder={`内容 ${num}`}
                      name={`content_${num}`}
                      value={formData[`content_${num}`]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [`content_${num}`]: e.target.value
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                {schedules[formData.date] && (
                  <Button type="button" variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button type="submit">
                  <Edit className="h-4 w-4 mr-2" />
                  {schedules[formData.date] ? '更新' : '保存'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>  
  </>

  );
};

export default ScheduleCalendar;
