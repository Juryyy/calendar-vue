
 
export function eventInputChecker(event: any) {
        if (event.title == null || event.title == "") {
            return false;
        } else if (event.description == null || event.description == "") {
            return false;
        } else if (event.start == null || event.start == "") {
            return false;
        }
        else if (event.end == null || event.end == "") {
            return false;
        }
        else if (event.userId == null || event.userId == "") {
            return false;
        }
        else {
            return true;
        }
}

export function descriptionChecker(description: string) {
    if (description == null || description == "") {
        return false;
    } else {
        return true;
    }
}

export function titleChecker(title: string) {
    if (title == null || title == "") {
        return false;
    } else {
        return true;
    }
}