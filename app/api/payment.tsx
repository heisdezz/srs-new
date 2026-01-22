export const create_config = (price: number, email: string) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: price * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: "pk_test_60245d2736a1b4def658bca730314c75cbc0becd",
  };
  return config;
};
