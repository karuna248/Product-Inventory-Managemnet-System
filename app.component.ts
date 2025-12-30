import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  apiUrl = 'http://localhost:8001/api/productcollection';

  products:any[]=[];
  product : any ={};
  editId:String|null = null;

  constructor(private http: HttpClient) {
    this.loadProducts();
  }
  // 🔹 READ
  loadProducts() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error(err)
    });
  }

  // 🔹 CREATE + UPDATE
  saveProduct() {

    if (
      !this.product.pro_code ||
      !this.product.pro_name ||
      !this.product.pro_category ||
      this.product.price === undefined ||
      this.product.price === null ||
      this.product.price === ''
    ) {
      alert('All fields are mandatory');
      return;
    }

    const payload = {
      pro_code: this.product.pro_code,
      pro_name: this.product.pro_name,
      pro_category: this.product.pro_category,
      price: Number(this.product.price)
    };
    

    // UPDATE
    if (this.editId) {
      this.http.put(`${this.apiUrl}/${this.editId}`, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadProducts();
        },
        error: err => alert(err.error?.message || 'Update failed')
      });

    // CREATE
    } else {
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadProducts();
        },
        error: err => alert(err.error?.message || 'Post failed')
      });
    }
  }

  // 🔹 EDIT
  editProduct(p: any) {
    this.product = { ...p };
    this.editId = p._id;
  }

  // 🔹 DELETE
  deleteProduct(id: string) {
    if (!confirm('Are you sure to delete?')) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadProducts(),
      error: err => console.error(err)
    });
  }

  // 🔹 RESET FORM
  resetForm() {
    this.product = {};
    this.editId = null;
  }
  
}
