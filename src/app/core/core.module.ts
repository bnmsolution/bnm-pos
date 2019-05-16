import { NgModule } from '@angular/core';

import { AppState } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';
import { LocalDbService } from 'src/app/services/localDb.service';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { RegisterSaleService } from 'src/app/services/register-sale.service';
import { RegisterService } from 'src/app/services/register.service';
import { TaxService } from 'src/app/services/tax.service';
import { VendorService } from 'src/app/services/vendor.service';
import { PosStoreService } from 'src/app/services/pos-store.service';
import { CategoryResolverService } from 'src/app/services/category-resolver.service';
import { StoreResolverService } from 'src/app/services/store.resolver.service';
import { TaxResolverService } from 'src/app/services/tax-resolver.service';
import { VendorResolverService } from 'src/app/services/vendor-resolver.service';
import { ImportService } from '../services/import.service';
import { MessageService } from '../services/message.service';
import { PrinterService } from '../services/printer.service';

@NgModule({
  providers: [
    AppState,
    HttpService,
    LocalDbService,
    CategoryService,
    CustomerService,
    EmployeeService,
    MenuService,
    ProductService,
    RegisterSaleService,
    RegisterService,
    TaxService,
    VendorService,
    PosStoreService,
    CategoryResolverService,
    StoreResolverService,
    TaxResolverService,
    VendorResolverService,
    ImportService,
    MessageService,
    PrinterService
  ]
})
export class CoreModule { }
