interface IBody {
    action: string;
}

type body = IBody & { [key: string]: string }

export const ajax = async <T>(bodyFields: body, callback?: Function): Promise<T> => {
    let body = new FormData();
    for (let field in bodyFields) body.append(field, bodyFields[field]);

    return new Promise(async (resolve, reject) => {

        // check online
        if (!navigator.onLine && callback) {
            callback('Нет подключения к интернету');
            return reject(false);
        }

        await fetch(`${window.location.origin}/core/`, {
            method: "post",
            mode  : "cors",
            body  : body
        }).then(
            response => {
                if (!response.ok) {
                    // console.log(response.statusText);
                }

                try {
                    // result - requested data
                    // console - debug output
                    let res = response.json() as Promise<{ result: any; console: any }>;

                    res.then(res => {
                        // if (res.console) console.log(res.console);

                        resolve(res.result as Promise<T>);
                    });
                } catch (error) {
                    reject('Произошла какая-то ошибка :((');
                }
            }, () => reject('Произошла какая-то ошибка :(('));
    });
}