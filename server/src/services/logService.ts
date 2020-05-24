import connectionService, { LogLevel } from './connectionService';

class LogService {
    public getLogLevel(): LogLevel {
        return connectionService.connection() ? connectionService.getSettings().logLevel : 'info';
    }

    public output(message: string, level: LogLevel = 'info') {
        const msgText = `${new Date().toISOString()}: ${message}`;
        const connection = connectionService.connection();
        if (connection) {
            switch (level) {
                case 'info':
                case 'verbose':
                    connection.console.log(msgText);
                    break;
                case 'error':
                    connection.console.error(msgText);
            }
        } else {
            console.log(msgText);
        }
    }

    public outputError(message: string) {
        return this.output(`[error] ${message}`);
    }
}

export default new LogService();
