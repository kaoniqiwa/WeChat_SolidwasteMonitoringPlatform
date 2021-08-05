import { TransformationType, TransformFnParams } from "class-transformer";

export function transformDate(params: TransformFnParams) {
  if (params.type === TransformationType.PLAIN_TO_CLASS) {
    return new Date(params.value);
  } else if (params.type === TransformationType.CLASS_TO_PLAIN) {
    return (params.value as Date).toISOString();
  } else if (params.type === TransformationType.CLASS_TO_CLASS) {
    return new Date(params.value);
  }
}
