import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  getAllTasks(): Task[] {
    return this.tasks;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const newTask: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);
    return newTask;
  }
  getExactTask(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
  deleteTask(id: string): Task {
    const found = this.getExactTask(id);
    const deletedTask = this.tasks.find((value) => value.id === found.id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return deletedTask;
  }
  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getExactTask(id);
    task.status = status;
    return task;
  }
  getTasksWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
      return tasks;
    }
  }
}
