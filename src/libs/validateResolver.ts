import { validateOrReject } from 'class-validator'

export const handlerValidate = async (data) => {
  try {
    await validateOrReject(data, {
      validationError: { target: false, value: false },
    })
  } catch (errors) {
    throw new Error(errors)
  }
}
