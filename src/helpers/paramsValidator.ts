/* eslint-disable import/prefer-default-export */
import moment from "moment";
import HttpException from "../exceptions/HttpException";

export const validateNumberParameter = (
  parameter: string,
  parameterName: string
): number => {
  // eslint-disable-next-line no-restricted-globals
  if (!parameter || isNaN(Number(parameter))) {
    throw new HttpException(
      400,
      `Parameter ${parameterName} is not present or is incorrect`
    );
  }
  return Number(parameter);
};

export const validateDateParameter = (
  parameter: string,
  parameterName: string
): Date => {
  const dateParameter = moment(parameter, "YYYY-MM-DD");

  if (!parameter || !dateParameter.isValid()) {
    throw new HttpException(
      400,
      `Parameter ${parameterName} is not present or is incorrect, date format: YYYY-MM-DD`
    );
  }
  return dateParameter.toDate();
};
