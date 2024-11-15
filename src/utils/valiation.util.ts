import { ValidationError } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CustomError } from "src/errors/custom.error";
import { ERR_INVALID_INPUT } from "src/errors/invalid-input.error";
import { Result } from "src/types/result.type";

export const getPrettyClassValidatorErrors = (
  validationErrors: ValidationError[],
  parentProperty = '',
): Array<{ property: string; errors: string[] }> => {
  const errors = [];

  const getValidationErrorsRecursively = (
    validationErrors: ValidationError[],
    parentProperty = '',
  ) => {
    for (const error of validationErrors) {
      const propertyPath = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      if (error.constraints) {
        errors.push({
          property: propertyPath,
          errors: Object.values(error.constraints),
        });
      }

      if (error.children?.length) {
        getValidationErrorsRecursively(error.children, propertyPath);
      }
    }
  };

  getValidationErrorsRecursively(validationErrors, parentProperty);

  return errors;
};

export async function validateInput<T, V>(cls: ClassConstructor<T>, plain: V): Promise<Result<T, CustomError>> {
  const inputInstance = plainToInstance(cls, plain)
  const validationErrs = await validate(inputInstance as Object)
  if (validationErrs.length > 0) {
    const prettyErrs = getPrettyClassValidatorErrors(validationErrs)
    return [null, new ERR_INVALID_INPUT(prettyErrs)]
  }

  return [inputInstance, null]
}
