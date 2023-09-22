import type { Result } from '.'
import { Dialogs, useDialogStore } from ':/dialogs'

export const hookResult = async <T>(resultPromise: Promise<Result<T>>) => {
  const result = await resultPromise
  if (!result.success && result.code === 999)
    useDialogStore().show(Dialogs.AuthenticateDialog)
  return result
}
