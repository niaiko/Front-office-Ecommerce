export class Vendeur {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
}

export class Magasin {
    code: string;
    emailAdress: string;
    adressChannel: string;
    long: number;
    lat: number;
    telephone: string;
    defaultShippingZoneId: number;
    token: string;
}

export const Permission = [
    "Authenticated",
    "SuperAdmin",
    "UpdateGlobalSettings",
    "CreateCatalog",
    "ReadCatalog",
    "UpdateCatalog",
    "DeleteCatalog",
    "CreateSettings",
    "ReadSettings",
    "UpdateSettings",
    "DeleteSettings",
    "CreateAdministrator",
    "ReadAdministrator",
    "UpdateAdministrator",
    "DeleteAdministrator",
    "CreateAsset",
    "ReadAsset",
    "UpdateAsset",
    "DeleteAsset",
    "CreateChannel",
    "ReadChannel",
    "UpdateChannel",
    "DeleteChannel",
    "CreateCollection",
    "ReadCollection",
    "UpdateCollection",
    "DeleteCollection",
    "CreateCountry",
    "ReadCountry",
    "UpdateCountry",
    "DeleteCountry",
    "CreateCustomer",
    "ReadCustomer",
    "UpdateCustomer",
    "DeleteCustomer",
    "CreateCustomerGroup",
    "ReadCustomerGroup",
    "UpdateCustomerGroup",
    "DeleteCustomerGroup",
    "CreateFacet",
    "ReadFacet",
    "UpdateFacet",
    "DeleteFacet",
    "CreateOrder",
    "ReadOrder",
    "UpdateOrder",
    "DeleteOrder",
    "CreatePaymentMethod",
    "ReadPaymentMethod",
    "UpdatePaymentMethod",
    "DeletePaymentMethod",
    "CreateProduct",
    "ReadProduct",
    "UpdateProduct",
    "DeleteProduct",
    "CreatePromotion",
    "ReadPromotion",
    "UpdatePromotion",
    "DeletePromotion",
    "CreateShippingMethod",
    "ReadShippingMethod",
    "UpdateShippingMethod",
    "DeleteShippingMethod",
    "CreateTag",
    "ReadTag",
    "UpdateTag",
    "DeleteTag",
    "CreateTaxCategory",
    "ReadTaxCategory",
    "UpdateTaxCategory",
    "DeleteTaxCategory",
    "CreateTaxRate",
    "ReadTaxRate",
    "UpdateTaxRate",
    "DeleteTaxRate",
    "CreateSystem",
    "ReadSystem",
    "UpdateSystem",
    "DeleteSystem",
    "CreateZone",
    "ReadZone",
    "UpdateZone",
    "DeleteZone"
]