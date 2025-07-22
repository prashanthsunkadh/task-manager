import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { title: '', description: '', status: 'To-Do', dueDate: '' };
  isLoading = true;
  error = '';
  isEditMode = false;

  private taskService = inject(TaskService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.error = '';
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tasks.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  onTaskSubmit() {
    this.taskService.addTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.resetForm();
      },
      error: (err) => (this.error = 'Failed to add task.'),
    });
  }

  /*
  onStatusChange(id: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value as Task['status'];
    this.taskService.updateTask(id, { status }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex((t) => t.id === id);
        console.log(index, updatedTask)
        if (index !== -1) this.tasks[index] = updatedTask;
      },
      error: (err) => (this.error = 'Failed to update status.'),
    });
  }*/
 onStatusChange(id: number, status: string) {
  this.taskService.updateTask(id, { status: status as Task['status'] }).subscribe({
    next: (updatedTask) => {
      const index = this.tasks.findIndex((t) => t.id === id);
      if (index !== -1) this.tasks[index] = updatedTask;
      // If you want to ensure view is updated, call ChangeDetectorRef.detectChanges(), but usually unnecessary with ngModel.
    },
    error: (err) => (this.error = 'Failed to update status.'),
  });
}


  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => (this.tasks = this.tasks.filter((t) => t.id !== id)),
        error: (err) => (this.error = 'Failed to delete task.'),
      });
    }
  }

  resetForm() {
    this.newTask = { title: '', description: '', status: 'To-Do', dueDate: '' };
    this.isEditMode = false;
  }

  logout() {
    this.authService.logout();
  }
}