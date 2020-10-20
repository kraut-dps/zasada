export class help {
	/**
	 * @template T
	 * @param {constructor<T>} Box
	 * @param {Partial<T>} oProps
	 */
	boxHelp( Box, oProps ) {
		oProps._Box = Box;
		return oProps;
	}
}
