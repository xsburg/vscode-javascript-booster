import connectionService from './connectionService';

class LogService {
    public output(message: string) {
        const connection = connectionService.connection();
        if (connection) {
            connection.console.log(`${new Date().toISOString()}: ${message}`);
        } else {
            // tslint:disable-next-line:no-console
            console.log(`${new Date().toISOString()}: ${message}`);
        }
    }

    public outputError(message: string) {
        return this.output(`[error] ${message}`);
    }
}

export default new LogService();
