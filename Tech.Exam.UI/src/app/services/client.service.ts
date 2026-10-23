import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Client } from '../interfaces/client';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly storageKey = 'tech-exam-clients';
  private readonly requestDelay = 300;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  public getClients(): Observable<Client[]> {
    return of(this.readClients()).pipe(delay(this.requestDelay));
  }

  public saveClient(client: Client): Observable<Client> {
    const clients = this.readClients();
    const savedClient: Client = {
      ...client,
      id: this.getNextId(clients),
    };

    clients.push(savedClient);
    this.writeClients(clients);

    return of(savedClient).pipe(delay(this.requestDelay));
  }

  public deleteClient(id: number): Observable<void> {
    const clients = this.readClients();
    const updatedClients = clients.filter((client) => client.id !== id);

    if (updatedClients.length === clients.length) {
      return throwError(() => new Error('Cliente no encontrado.'));
    }

    this.writeClients(updatedClients);
    return of(void 0).pipe(delay(this.requestDelay));
  }

  public updateClient(id: number, client: Client): Observable<Client> {
    const clients = this.readClients();
    const index = clients.findIndex((savedClient) => savedClient.id === id);

    if (index === -1) {
      return throwError(() => new Error('Cliente no encontrado.'));
    }

    const updatedClient: Client = { ...client, id };
    clients[index] = updatedClient;
    this.writeClients(clients);

    return of(updatedClient).pipe(delay(this.requestDelay));
  }

  private readClients(): Client[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const savedClients = localStorage.getItem(this.storageKey);

    if (!savedClients) {
      return [];
    }

    try {
      const clients = JSON.parse(savedClients) as Client[];
      return Array.isArray(clients) ? clients : [];
    } catch {
      return [];
    }
  }

  private writeClients(clients: Client[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(clients));
    }
  }

  private getNextId(clients: Client[]): number {
    return clients.length === 0
      ? 1
      : Math.max(...clients.map((client) => client.id)) + 1;
  }

  private searchClients(searchTerm: string): Observable<Client[]> {
    const clients = this.readClients();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredClients = clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        client.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        client.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
        client.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

    return of(filteredClients).pipe(delay(this.requestDelay));
  }
}
