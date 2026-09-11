import SSLCommerzPayment from "sslcommerz-lts";
import config from "../config";

export const sslCommerz = new SSLCommerzPayment(
  config.ssl_commerz_store_id,
  config.ssl_commerz_store_passwd,
  config.ssl_commerz_is_live,
);