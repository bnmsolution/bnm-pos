import { NgModule } from '@angular/core';

import { AppState } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';
import { LocalDbService } from 'src/app/services/localDb.service';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmployeeService } from 'src/app/services/employee.service';
// import { InventoryService } from 'src/app/services/inventory.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { RegisterSaleService } from 'src/app/services/register-sale.service';
import { RegisterService } from 'src/app/services/register.service';
import { TaxService } from 'src/app/services/tax.service';
import { VendorService } from 'src/app/services/vendor.service';
import { SettingsService } from 'src/app/services/settings.service';
import { CategoryResolverService } from 'src/app/services/category-resolver.service';
import { SettingsResolverService } from 'src/app/services/settings.resolver.service';
import { TaxResolverService } from 'src/app/services/tax-resolver.service';
import { VendorResolverService } from 'src/app/services/vendor-resolver.service';

@NgModule({
  providers: [
    AppState,
    HttpService,
    LocalDbService,
    CategoryService,
    CustomerService,
    EmployeeService,
    // InventoryService,
    MenuService,
    ProductService,
    RegisterSaleService,
    RegisterService,
    TaxService,
    VendorService,
    SettingsService,
    CategoryResolverService,
    SettingsResolverService,
    TaxResolverService,
    VendorResolverService
  ]
})
export class CoreModule { }
