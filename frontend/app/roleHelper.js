function decideHeader() {
    if(role=="admin") {
        <header ng-include="'adminHeader.html'"></header>
    } else if(role=="tutor" || role=="student") {
        <header ng-include="'studentHeader.html'"></header>
    } else {
        <header ng-include="'guestHeader.html'"></header>
    }
}