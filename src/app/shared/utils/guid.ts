export class Guid {
    public static empty = '00000000-0000-0000-0000-000000000000';

    public static newGuid() {
        let d = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}

class Formatter {
    public static pad(value: any, width: number, char?: string) {
        char = char || '0';
        value = value + '';
        return value.length >= width ? value : new Array(width - value.length + 1).join(char) + value;
    }
}