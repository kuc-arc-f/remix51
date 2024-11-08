import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Head from '../components/Head';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    content: '',
    datetime_1: '',
    datetime_content1: '',
    datetime_2: '',
    datetime_content2: '',
    datetime_3: '',
    datetime_content3: '',
    datetime_4: '',
    datetime_content4: '',
    datetime_5: '',
    datetime_content5: '',
  });

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSchedule) {
      setSchedules(schedules.map(schedule => 
        schedule.id === editingSchedule.id ? { ...formData, id: editingSchedule.id } : schedule
      ));
    } else {
      setSchedules([...schedules, { ...formData, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingSchedule(null);
    setFormData({
      date: '',
      content: '',
      datetime_1: '',
      datetime_content1: '',
      datetime_2: '',
      datetime_content2: '',
      datetime_3: '',
      datetime_content3: '',
      datetime_4: '',
      datetime_content4: '',
      datetime_5: '',
      datetime_content5: '',
    });
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData(schedule);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  return (
  <>
    <Head />
    <div className="p-4">
      <h1 className="text-4xl font-bold">Plan2</h1>
      <hr className="my-2" />
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth}>&lt;</Button>
        <h2 className="text-xl font-bold">
          {format(selectedDate, 'yyyy年 MM月', { locale: ja })}
        </h2>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="p-2 text-center font-bold border">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const daySchedules = schedules.filter(schedule => 
            isSameDay(new Date(schedule.date), day)
          );
          
          return (
            <div
              key={day.toString()}
              className={`p-2 border min-h-24 ${
                !isSameMonth(day, selectedDate) ? 'bg-gray-100' : ''
              }`}
            >
              <div className="text-right">{format(day, 'd')}</div>
              {daySchedules.map(schedule => (
                <div key={schedule.id} className="mt-1">
                  <div className="bg-blue-100 p-1 text-sm rounded">
                    <div>{schedule.content}</div>
                    <div className="flex gap-2 mt-1">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(schedule)}
                      >
                        編集
                      </Button>
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4">新規予定追加</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? '予定を編集' : '新規予定追加'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">日付</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1">内容</label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </div>
            {[1, 2, 3, 4, 5].map(num => (
              <div key={num} className="space-y-2">
                <div>
                  <label className="block mb-1">日時 {num}</label>
                  <Input
                    type="datetime-local"
                    name={`datetime_${num}`}
                    value={formData[`datetime_${num}`]}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block mb-1">内容 {num}</label>
                  <Textarea
                    name={`datetime_content${num}`}
                    value={formData[`datetime_content${num}`]}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ))}
            <Button type="submit">
              {editingSchedule ? '更新' : '追加'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>  
  </>

  );
};

export default Calendar;
