// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
//
// import {CrudService, HttpService, LocalDbService} from 'src/app/core';
// // import { Inventory } from 'pos-models';
// import { AppState } from '../services/app.service';
//
// const documentName = 'inventory';
//
// @Injectable()
// export class InventoryService extends DataStoreService<Inventory> {
//   constructor(
//     private httpService: HttpService,
//     private localDbService: LocalDbService,
//     private appState: AppState) {
//     super(localDbService, httpService, Inventory, documentName);
//     // this.loadAll();
//   }
//
//   /**
//    * Finds an inventory by master product id.
//    *
//    * @param {string} masterProductId  master productId
//    * @returns {Promise<Inventory>}
//    * @memberof InventoryService
//    */
//   // public findByProductId(masterProductId: string): Promise<Inventory> {
//   //   return this.findByPropertyName('masterProductId', masterProductId);
//   // }
//
//   /**
//    * Decreases inventory count and creates an inventory transaction.
//    *
//    * @param {string} saleId
//    * @param {string} masterProductId
//    * @param {string} productId
//    * @param {number} quantity
//    * @param {string} descripiton
//    * @memberof InventoryService
//    */
//   // public decreaseInventoryCount(saleId: string, masterProductId: string, productId: string, quantity: number, descripiton: string) {
//   //   this.findByProductId(masterProductId)
//   //     .then(inventory => {
//   //       if (inventory) {
//   //         const inventoryItem = inventory.inventoryItems.find((ii: InventoryItem) =>
//   //           ii.productId === productId && ii.storeId === this.appState.currentStore.id);
//
//   //         if (inventoryItem) {
//   //           inventoryItem.count -= quantity;
//
//   //           const transaction = InventoryTransaction.create(
//   //             this.appState.currentStore.id, productId, saleId,
//   //             this.appState.currentUser.id, -quantity, descripiton);
//   //           inventory.transactions.push(transaction);
//
//   //           this.updateItem(inventory.serialize())
//   //             .subscribe(() => console.log('Inventory updated'));
//   //         }
//   //       }
//   //     });
//   // }
//
//   // public activateInventory(masterProductId: string): Promise<any> {
//   //   return this.findByProductId(masterProductId)
//   //     .then(inventory => {
//   //       return this.httpClient.post("inventory/activate", inventory)
//   //         .then(() => {
//   //           console.log(`[InventoryService] Activated inventory to back-end(${masterProductId})`);
//   //           inventory.activated = true;
//   //           this.notify();
//   //           this.dataStoreService.addToLocalDb("inventory", inventory.toDTO());
//   //         })
//   //         .catch((err) => {
//   //           console.error(`[InventoryService] Activated inventory to back-end(${masterProductId})`);
//   //           console.error(err);
//   //         });
//   //     });
//   // }
//
//   // public deactivateInventory(masterProductId: string): Promise<any> {
//   //   return this.findByProductId(masterProductId)
//   //     .then(inventory => {
//   //       return this.httpClient.post("inventory/deactivate", inventory)
//   //         .then(() => {
//   //           console.log(`[InventoryService] Deactivated inventory to back-end(${masterProductId})`);
//   //           inventory.activated = false;
//   //           this.notify();
//   //           this.dataStoreService.addToLocalDb("inventory", inventory.toDTO());
//   //         })
//   //         .catch((err) => {
//   //           console.error(`[InventoryService] Activated inventory to back-end(${masterProductId})`);
//   //           console.error(err);
//   //         });
//   //     });
//   // }
// }
