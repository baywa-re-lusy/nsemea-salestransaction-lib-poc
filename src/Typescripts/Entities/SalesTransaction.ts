/**
 * Netsuite SalesTransaction record type
 */
import { TransactionBase } from '@nsemea_lib/Core/DataAccess/TransactionBase';
import {
  FieldTypeDecorator,
  Nullable,
  SubListDecorator,
  SubRecordDecorator,
} from '@nsemea_lib/Core/DataAccess/NSTypedRecord';
import {
  NSSubList,
  SubListFieldTypeDecorator,
} from '@nsemea_lib/Core/DataAccess/NSSubList';
import { NSSubListLine } from '@nsemea_lib/Core/DataAccess/NSSubListLine';
import { Address } from '@nsemea_lib/Entities/Address';

export enum poTypeList {
  dropShip = 'Drop Ship',
  specialOrder = 'Special Order',
  transportOrder = 'Transport Order',
  warrantyExtension = 'Warranty Extension',
}

/**
 * Sublist 'item' on the quote record
 */
export class ItemSublist extends NSSubListLine {
  @SubListFieldTypeDecorator()
  accessor item: number;

  @SubListFieldTypeDecorator()
  accessor quantity: Nullable<number>;

  @SubListFieldTypeDecorator()
  accessor quantitycommitted: Nullable<number>;

  @SubListFieldTypeDecorator()
  accessor commitinventory: Nullable<number>;

  @SubListFieldTypeDecorator()
  accessor amount: number;

  @SubListFieldTypeDecorator()
  accessor rate: number;

  @SubListFieldTypeDecorator()
  accessor custcol_qty_inicial: number;

  @SubListFieldTypeDecorator()
  accessor weightinlb: number;
}

/**
 * Sublist 'salesteam' on sales orders
 */
export class SalesTeamSublist extends NSSubListLine {
  @SubListFieldTypeDecorator()
  accessor contribution: number;

  @SubListFieldTypeDecorator()
  accessor employee: number;

  @SubListFieldTypeDecorator()
  accessor isprimary: boolean;

  @SubListFieldTypeDecorator()
  accessor salesrole: number;
}

/**
 * Estimate (SalesTransaction)
 */
export class SalesTransaction extends TransactionBase {
  @SubRecordDecorator(Address)
  accessor shippingaddress: Address;

  @SubListDecorator(ItemSublist)
  accessor item: NSSubList<ItemSublist>;

  @SubListDecorator(SalesTeamSublist)
  accessor salesteam: NSSubList<SalesTeamSublist>;

  @FieldTypeDecorator()
  accessor custbody_shippinginstructions: string;

  @FieldTypeDecorator()
  accessor custbody_freeshipping: boolean;

  @FieldTypeDecorator()
  accessor custbody_residentialdelivery: boolean;

  @FieldTypeDecorator()
  accessor custbody_smalltruckrequired: boolean;

  @FieldTypeDecorator()
  accessor custbody_truckwforkliftreq: boolean;

  @FieldTypeDecorator()
  accessor custbody_craneonsite: boolean;

  @FieldTypeDecorator()
  accessor custbody_timedeliveryfrom: number;

  @FieldTypeDecorator()
  accessor custbody_timedeliverytill: number;

  @FieldTypeDecorator()
  accessor custbody_delivery_am: boolean;

  @FieldTypeDecorator()
  accessor custbody_delivery_pm: boolean;
  //
  @FieldTypeDecorator()
  accessor custbody_itsy_difficult_delivery: boolean;

  @FieldTypeDecorator()
  accessor custbody_itsy_side_unload: boolean;

  @FieldTypeDecorator()
  accessor custbody_itsy_manned_unloading_place: boolean;

  @FieldTypeDecorator()
  accessor custbody_itsy_customer_owns_a_forklift: boolean;

  @FieldTypeDecorator()
  accessor custbody_phonecontactonsite: string;

  @FieldTypeDecorator()
  accessor custbody_deliveryapptrequired: boolean;

  @FieldTypeDecorator()
  accessor custbody_callahead: boolean;

  @FieldTypeDecorator()
  accessor custbody_liftgaterequired: boolean;

  @FieldTypeDecorator()
  accessor custbody_shipblind: boolean;

  @FieldTypeDecorator()
  accessor shippingcost: number;

  @FieldTypeDecorator()
  accessor custbody_potype: number;

  @FieldTypeDecorator({ fieldId: 'custbody_potype', asText: true })
  accessor custbody_potype_name: string;

  @FieldTypeDecorator()
  accessor custbody_wms_pickdate: Nullable<Date>;

  @FieldTypeDecorator()
  accessor custbody_wms_pickdate_isDisabled: boolean;

  @FieldTypeDecorator()
  accessor custbody_internalsalesstatus: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_logisticsplanningstatus: number;

  @FieldTypeDecorator()
  accessor shipmethod: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_namecontactonsite: string;

  @FieldTypeDecorator()
  accessor custbody_tranfollowupstatus: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_ctk_selected_payment: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_finaldestination: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_finaldestinationcustomer: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_location: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_expectedshipdate: Nullable<Date>;

  @FieldTypeDecorator()
  accessor custbody_final_destination_details: string;

  @FieldTypeDecorator()
  accessor custbody_finaldestination_country: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_warehouseinstructions: string;

  @FieldTypeDecorator()
  accessor terms: Nullable<number>;

  @FieldTypeDecorator()
  accessor custbody_urgent_order: boolean;

  @FieldTypeDecorator()
  accessor custbody_wms_wipflag: boolean;

  @FieldTypeDecorator()
  accessor shipaddresslist: number;
}
