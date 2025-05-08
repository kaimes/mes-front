export function required(value) {
    let result;
    if (value === undefined || value == null || (Array.isArray(value) && !value.length)) {
        result = false;
    } else {
        result = !!String(value).trim().length;
    }

    return result || 'This field is required';
}

/**
 * @copyright Abdelrahman Awad
 * @licence MIT
 */
const emailRe =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function email(value) {
    return emailRe.test(String(value)) || 'Must be a valid email';
}

const rules = {
    required: value => !!value || 'this filed is Required.',
    counter: value => value.length <= 20 || 'Max 20 characters',
    email: value => {
        return emailRe.test(String(value)) || 'Invalid e-mail.';
    }
};

export default rules;
