export type ActionSuccess<T> = { _type: "success"; value: T };
export type ActionFailure = { _type: "failure"; error: string };

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

export const success = <T>(value: T): ActionSuccess<T> => ({
	_type: "success",
	value,
});

export const failure = (error: string): ActionFailure => ({
	_type: "failure",
	error,
});
