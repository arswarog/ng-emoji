import { Component } from '@angular/core';

@Component({
    selector: 'body',
    templateUrl: './app.html'
})
export class AppComponent {

    // Global
    protected window = window;

    // View / edit
    protected editText: string = 'Input text\nLine 2';

    // View and edit
    protected editable: boolean = false;

    // Chat
    protected messages: string[] = [];

}
