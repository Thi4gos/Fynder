import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistryPageRoutingModule } from './registry-routing.module';

import { RegistryPage } from './registry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegistryPageRoutingModule
  ],
  declarations: [RegistryPage]
})
export class RegistryPageModule {}
