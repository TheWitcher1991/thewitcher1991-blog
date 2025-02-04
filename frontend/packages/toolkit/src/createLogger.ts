export type LogLevel = 'log' | 'error'

export interface LoggerOptions {
	bgColor?: string
	textColor?: string
	shouldLog?: boolean | (() => boolean)
}

export function createLogger(
	scope: string,
	options?: LoggerOptions,
): [
	log: (force: boolean, ...args: any[]) => void,

	error: (force: boolean, ...args: any[]) => void,
] {
	options ||= {}
	const { textColor, bgColor, shouldLog: optionsShouldLog } = options
	const shouldLogValue =
		optionsShouldLog === undefined ? true : optionsShouldLog
	const shouldLog =
		typeof shouldLogValue === 'boolean'
			? () => shouldLogValue
			: shouldLogValue

	function print(level: LogLevel, force: boolean, ...args: any[]): void {
		if (force || shouldLog()) {
			const commonCss = 'font-weight:bold;padding:0 5px;border-radius:5px'
			console[level](
				`%c${Intl.DateTimeFormat('en-GB', {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					timeZone: 'UTC',
				}).format(new Date())}%c / %c${scope}`,
				`${commonCss};background-color: lightblue;color:black`,
				'',
				`${commonCss};${textColor ? `color:${textColor};` : ''}${bgColor ? `background-color:${bgColor}` : ''}`,
				...args,
			)
		}
	}

	return [print.bind(undefined, 'log'), print.bind(undefined, 'error')]
}
