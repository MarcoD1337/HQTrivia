import fetch, {Headers} from "node-fetch"

export enum TokenType {
    Access = "accessToken",
    Auth = "authToken",
    Login = "loginToken"
}

export class Client {
    token: string
    type: TokenType
    apiUrl: string = "https://api-quiz.skrt.space"
    clientVersion: string = "iOS/1.6.9 b272"

    constructor(token: string, type: TokenType) {
        this.token = token
        this.type = type
    }

    public get defaultHeaders(): Headers {
        let headers = new Headers({
            "x-hq-client": this.clientVersion,
            "Authorization": `Bearer ${this.token}`,
            "Content-Type": "application/json"
        })
        return headers
    }

    usersMe(): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            if(this.type !== "loginToken") {
                fetch(`${this.apiUrl}/users/me`, {
                    headers: this.defaultHeaders
                })
                    .then(res => res.json())
                    .then(resolve)
            }
            else {
                reject("This function is restricted to either access or auth tokens.")
            }
        })
    }

    usersMePayouts(): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            if(this.type !== "loginToken") {
                fetch(`${this.apiUrl}/users/me/payouts`, {
                    headers: this.defaultHeaders
                })
                    .then(res => res.json())
                    .then(resolve)
            }
            else {
                reject("This function is restricted to either access or auth tokens.")
            }
        })
    }

    getSchedule(): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            if(this.type !== "loginToken") {
                fetch(`${this.apiUrl}/shows/schedule`, {
                    headers: this.defaultHeaders
                })
                    .then(res => res.json())
                    .then(resolve)
            }
            else {
                reject("This function is restricted to either an access or auth token.")
            }
        })
    }

    getShows(): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            if(this.type !== "loginToken") {
                fetch(`${this.apiUrl}/shows/now`, {
                    headers: this.defaultHeaders
                })
                    .then(res => res.json())
                    .then(resolve)
            }
            else {
                reject("This function is restricted to either an access or auth token.")
            }
        })
    }

    refreshTokens(): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            if(this.type === "loginToken") {
                let headers: Headers = this.defaultHeaders
                headers.delete("Authorization")
                fetch(`${this.apiUrl}/tokens`, {
                    headers: this.defaultHeaders,
                    method: "POST",
                    body: JSON.stringify({ "token": this.token })
                })
                    .then(res => res.json())
                    .then(resolve)
            }
            else {
                reject("This function is restricted to an login tokens only.")
            }
        })
    }
}

export class Login {
    apiUrl: string = "https://api-quiz.skrt.space"
    clientVersion: string = "iOS/1.6.9 b272"

    public get defaultHeaders(): Headers {
        let headers = new Headers({
            "x-hq-client": this.clientVersion,
            "Content-Type": "application/json"
        })
        return headers
    }

    requestText(phone: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            fetch(`${this.apiUrl}/verifications`, {
                headers: this.defaultHeaders,
                method: "POST",
                body: JSON.stringify({ "phone": phone, "method": "sms" })
            })
                .then(res => res.json())
                .then(resolve)
        })
    }

    submitCode(verificationId: string, code: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            fetch(`${this.apiUrl}/verifications/${verificationId}`, {
                headers: this.defaultHeaders,
                method: "POST",
                body: JSON.stringify({ "code": code })
            })
                .then(res => res.json())
                .then(resolve)
        })
    }
}