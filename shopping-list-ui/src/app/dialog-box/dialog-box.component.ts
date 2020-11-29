import { Component, Inject, Optional }   from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData }                    from './model/dialog-data';

@Component(
    {
        selector:    'app-dialog-box',
        templateUrl: './dialog-box.component.html',
        styleUrls:   ['./dialog-box.component.less']
    }
)
export class DialogBoxComponent {

    readonly action: string;
    readonly localData: any;

    constructor(
        private dialogRef: MatDialogRef<DialogBoxComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: DialogData
    ) {
        this.localData = { ...data };
        this.action = this.localData.action;
    }

    doAction(): void {
        this.dialogRef.close({ event: this.action, data: this.localData });
    }

    closeDialog(): void {
        this.dialogRef.close({ event: 'Cancel' });
    }

}
