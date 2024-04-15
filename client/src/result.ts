export type Ok<value> = {
  kind: "Ok";
  value: value;
};

export function Ok<value>(value: value): Ok<value> {
  return {
    kind: "Ok",
    value,
  };
}

export type Err<message> = {
  kind: "Err";
  message: message;
};

export function Err<message>(message: message): Err<message> {
  return {
    kind: "Err",
    message,
  };
}

export type Result<value, message> = Ok<value> | Err<message>;
