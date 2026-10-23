import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ClientService } from '../../services/client.service';
import { Client } from '../../interfaces/client';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent {
  id: number = 0;
  name: string = "";
  firstName : string = "";
  lastName: string = "";
  email: string = "";
  phone: string = "";
  clients: Client[] = [];
  editingClientId: number | null = null;
  editedClient: Client | null = null;
  searchTerm: string = '';
  searchResults: Client[] = [];
  private debouncedSearchTerm = '';
  private readonly searchChanges = new Subject<string>();

  constructor(
    private clientService: ClientService,
    destroyRef: DestroyRef
  ) {
    this.searchChanges.pipe(
      debounceTime(300),
      map((searchTerm) => searchTerm.trim().toLocaleLowerCase()),
      distinctUntilChanged(),
      takeUntilDestroyed(destroyRef)
    ).subscribe((searchTerm) => {
      this.debouncedSearchTerm = searchTerm;
    });
  }

  get filteredClients(): Client[] {
    if (!this.debouncedSearchTerm) {
      return this.clients;
    }

    return this.clients.filter((client) =>
      [
        client.id,
        client.name,
        client.firstName,
        client.lastName,
        client.email,
        client.phone
      ].some((value) =>
        String(value).toLocaleLowerCase().includes(this.debouncedSearchTerm)
      )
    );
  }

  ngOnInit(): void {
    this.getClients();
  }

  onSearchInput(searchTerm: string): void {
    this.searchChanges.next(searchTerm);
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    let client: Client;
    client = {
         id:  0,
         name:  this.name,
         firstName:  this.firstName,
         lastName:  this.lastName,
         email: this.email,
         phone:  this.phone
    } 
    
    this.clientService.saveClient(client)
    .subscribe({
      next: (data: any) => {
        alert("Client saved successfully.");
        this.resetForm(form);
        this.getClients();
      }, error: (err) => console.log(err)
    });
  }

  resetForm(form: NgForm) {
    this.id = 0;
    this.name = "";
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.phone = "";
    form.resetForm();

  }

  startEditClient(client: Client): void {
    this.editingClientId = client.id;
    this.editedClient = { ...client };
  }
  cancelEditClient(): void {
    this.editingClientId = null;
    this.editedClient = null;
  }
  saveEditedClient(): void {
    if (!this.isEditedClientValid()) {
      alert('Please complete all fields with valid data before saving.');
      return;
    }

    this.clientService.updateClient(this.editedClient!.id, this.editedClient!).subscribe({
      next: () => {
        alert('Client updated successfully.');
        this.cancelEditClient();
        this.getClients();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update the client.');
      }
    });
  }

  isEditedClientValid(): boolean {
    const client = this.editedClient;

    return !!client
      && client.name.trim().length > 0
      && client.firstName.trim().length > 0
      && client.lastName.trim().length > 0
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)
      && /^[0-9]+$/.test(client.phone);
  }
 getClients(){  
    this.clientService.getClients()
    .subscribe({
      next: (data: any) => {
        this.clients = data;
      }, error: (err) => console.log(err)
    });
  }

  deleteClient(id: number): void {
    if (!confirm('Do you want to delete this client?')) {
      return;
    }

    this.clientService.deleteClient(id)
      .subscribe({
        next: () => {
          alert('Client deleted successfully.');
          this.getClients();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete the client.');
        }
      });
  }

}
