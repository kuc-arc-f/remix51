// app/components/TodoDialog.tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TodoDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TodoData) => void
  initialData?: TodoData
  mode: 'create' | 'edit'
}

export interface TodoData {
  title: string
  content: string
  content_type: string
  age: string
  public: boolean
  food_orange: boolean
  food_apple: boolean
  food_banana: boolean
  food_melon: boolean
  food_grape: boolean
  date_publish: string
  date_update: string
  post_number: string
  address_country: string
  address_pref: string
  address_city: string
  address_1: string
  address_2: string
  text_option1: string
  text_option2: string
}

export function TodoDialog({ isOpen, onClose, onSubmit, initialData, mode }: TodoDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data: Partial<TodoData> = {}
    
    // Text inputs
    const textFields = [
      'title', 'content', 'content_type', 'age', 'post_number',
      'address_country', 'address_pref', 'address_city', 'address_1', 'address_2',
      'text_option1', 'text_option2'
    ]
    textFields.forEach(field => {
      data[field] = formData.get(field) as string
    })

    // Checkbox inputs
    const checkboxFields = ['food_orange', 'food_apple', 'food_banana', 'food_melon', 'food_grape']
    checkboxFields.forEach(field => {
      data[field] = formData.get(field) === 'on'
    })

    // Radio input
    data.public = formData.get('public') === 'true'

    // Date inputs
    data.date_publish = formData.get('date_publish') as string
    data.date_update = formData.get('date_update') as string

    onSubmit(data as TodoData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Todo' : 'Edit Todo'}</DialogTitle>
          <DialogDescription>
            Fill in the details for your todo item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={initialData?.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Input id="content" name="content" defaultValue={initialData?.content} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_type">Content Type</Label>
              <Input id="content_type" name="content_type" defaultValue={initialData?.content_type} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" defaultValue={initialData?.age} />
            </div>

            {/* Public/Private Radio */}
            <div className="col-span-2 space-y-2">
              <Label>Visibility</Label>
              <RadioGroup defaultValue={initialData?.public ? 'true' : 'false'} name="public">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="public" />
                  <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Food Checkboxes */}
            <div className="col-span-2 space-y-2">
              <Label>Food Preferences</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="food_orange" name="food_orange" defaultChecked={initialData?.food_orange} />
                  <Label htmlFor="food_orange">Orange</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="food_apple" name="food_apple" defaultChecked={initialData?.food_apple} />
                  <Label htmlFor="food_apple">Apple</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="food_banana" name="food_banana" defaultChecked={initialData?.food_banana} />
                  <Label htmlFor="food_banana">Banana</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="food_melon" name="food_melon" defaultChecked={initialData?.food_melon} />
                  <Label htmlFor="food_melon">Melon</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="food_grape" name="food_grape" defaultChecked={initialData?.food_grape} />
                  <Label htmlFor="food_grape">Grape</Label>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <Label htmlFor="date_publish">Publish Date</Label>
              <Input type="date" id="date_publish" name="date_publish" defaultValue={initialData?.date_publish} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_update">Update Date</Label>
              <Input type="date" id="date_update" name="date_update" defaultValue={initialData?.date_update} />
            </div>

            {/* Address Information */}
            <div className="space-y-2">
              <Label htmlFor="post_number">Post Number</Label>
              <Input id="post_number" name="post_number" defaultValue={initialData?.post_number} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_country">Country</Label>
              <Input id="address_country" name="address_country" defaultValue={initialData?.address_country} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_pref">Prefecture</Label>
              <Input id="address_pref" name="address_pref" defaultValue={initialData?.address_pref} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_city">City</Label>
              <Input id="address_city" name="address_city" defaultValue={initialData?.address_city} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_1">Address Line 1</Label>
              <Input id="address_1" name="address_1" defaultValue={initialData?.address_1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_2">Address Line 2</Label>
              <Input id="address_2" name="address_2" defaultValue={initialData?.address_2} />
            </div>

            {/* Optional Text Fields */}
            <div className="space-y-2">
              <Label htmlFor="text_option1">Option 1</Label>
              <Input id="text_option1" name="text_option1" defaultValue={initialData?.text_option1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text_option2">Option 2</Label>
              <Input id="text_option2" name="text_option2" defaultValue={initialData?.text_option2} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Add Todo' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}