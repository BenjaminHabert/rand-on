const randomChooser = (values, weights) => function () {
    if (weights === undefined)
        return random(values)

    const total = weights.reduce((acc, current) => acc + current);
    const r = random(total);
    let current = 0;
    for (let i = 0; i < values.length; i++) {
        current += weights[i];
        if (current > r) return values[i];
    }
}

function get_value(item) {
    try {
        return item();
    }
    catch (TypeError) {
        return item;
    }
}

function compose(baseObject, ...objectBehaviors) {
    let composedObject = Object.assign(baseObject);
    for (let behaviour of objectBehaviors) {
        try {
            composedObject = Object.assign(
                composedObject,
                behaviour(composedObject)
            )
        }
        catch (TypeError) {
            composedObject = Object.assign(
                composedObject,
                behaviour
            )
        }
    }
    return composedObject;
}