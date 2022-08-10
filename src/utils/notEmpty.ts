/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    if (value === null || value === undefined) {
        return false;
    }
    return true;
}
