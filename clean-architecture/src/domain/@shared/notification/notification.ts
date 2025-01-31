export type NotificationErrorProps = {
    message: string;
    context: string;
}

export default class Notification {
    private errors: NotificationErrorProps[] = [];

    addError(error: NotificationErrorProps) {
        this.errors.push(error)
    }

    getErrors(){
        return this.errors;
    }

    messages(context?: string): string {
        let messages = "";

        this.errors.forEach(error => {
            console.log(context, error.context)
            if (context === undefined || context === error.context) {
                messages += `${error.context}: ${error.message};`
            }
        })

        messages = messages.replace(/\;$/, "")
        return messages
    }

    hasErrors(): boolean {
        return this.errors.length > 0
    }
}