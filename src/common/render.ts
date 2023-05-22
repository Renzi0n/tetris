export const enum RenderPosition {
  AFTERBEGIN = `AFTERBEGIN`,
  BEFOREEND = `BEFOREEND`
};

export const render = (containerElement: Element | null, element: Element | null, place: RenderPosition) => {
    if (element === null || containerElement === null) {
        throw new Error(`Can't render unexisting elements`);
    }

    switch (place) {
        case RenderPosition.AFTERBEGIN:
        containerElement.prepend(element);
        break;
        case RenderPosition.BEFOREEND:
        containerElement.append(element);
        break;
    }
};

export const createElement = (template: string): Element => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;

    return newElement.firstElementChild as Element;
};

export const replace = (newChild: Element | null, oldChild: Element | null) => {
    if (parent === null || oldChild === null || newChild === null) {
        throw new Error(`Can't replace unexisting elements`);
    }

    oldChild.replaceWith(newChild);
};