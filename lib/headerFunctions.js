function changeOpacity(scrollPos) {
    // scrollPos = 0 -> opacity = 0
    // scrollPos = 300 -> opacity = 1
    const offset = 300
    let newOpacity = 1 - (offset - scrollPos) / offset
    setOpacity(newOpacity)
    // till scorllPos = 300 -> textOpacity = 0
    // scrollPos = 310 => textOpacity = 1
    const textTransition = 10
    let delta = 0
    if ((scrollPos - offset) > 0) delta = scrollPos - offset
    setTextOpacity(1 - ((textTransition - delta) / textTransition))
}

export { changeOpacity };