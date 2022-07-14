import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LayoutModule } from "../../../layout/layout.module";
import { PartialsModule } from "../../../partials/partials.module";
import { ListTimelineModule } from "../../../partials/layout/quick-sidebar/list-timeline/list-timeline.module";
import { WidgetChartsModule } from "../../../partials/content/widgets/charts/widget-charts.module";
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatFormFieldModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatTabsModule,
	MatTooltipModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatSnackBarModule,
	MatTableModule,
	MatGridListModule,
	MatToolbarModule,
	MatBottomSheetModule,
	MatDividerModule,
	MatSortModule,
	MatStepperModule,
	MatChipsModule,
	MatPaginatorModule,
	MatRadioModule,
	MatTreeModule,
	MatButtonToggleModule,
	MAT_BOTTOM_SHEET_DATA,
	MAT_DATE_LOCALE,
	MAT_DATE_FORMATS,
	DateAdapter,
	MatPaginatorIntl,
} from "@angular/material";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDialogModule } from "@angular/material/dialog";
import { CoreModule } from "../../../../core/core.module";
import { MaterialPreviewModule } from "../../../partials/content/general/material-preview/material-preivew.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CodePreviewModule } from "../../../partials/content/general/code-preview/code-preview.module";
import { ManagerDealerComponent } from "./manager-dealer.component";
import { DealersComponent } from "./dealer-list/dealers.component";

import { HttpClientModule } from "@angular/common/http";
import { DealersCreateComponent } from "./dealers-create/dealers-create.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AddMemberComponent } from "./dealers-create/add-member/add-member.component";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { CustomMatPaginatorIntl } from "./customs/custom-mat-paginator-int";
const routes: Routes = [
	{
		path: "",
		component: ManagerDealerComponent,
		children: [
			{
				path: "agent/manager/list",
				component: DealersComponent,
			},
		],
	},
];
export const MY_FORMATS = {
	parse: {
		dateInput: "LL",
	},
	display: {
		dateInput: "DD-MM-YYYY",
		monthYearLabel: "YYYY",
		dateA11yLabel: "LL",
		monthYearA11yLabel: "YYYY",
	},
};
@NgModule({
	imports: [
		LayoutModule,
		MatInputModule,
		MatFormFieldModule,
		MatDatepickerModule,
		MatAutocompleteModule,
		MatListModule,
		MatSliderModule,
		MatCardModule,
		MatSelectModule,
		MatButtonModule,
		MatIconModule,
		MatSlideToggleModule,
		MatCheckboxModule,
		MatMenuModule,
		MatTabsModule,
		MatTooltipModule,
		MatSidenavModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatTableModule,
		MatGridListModule,
		MatToolbarModule,
		MatBottomSheetModule,
		MatExpansionModule,
		MatDividerModule,
		MatSortModule,
		MatStepperModule,
		MatChipsModule,
		MatPaginatorModule,
		MatDialogModule,
		CoreModule,
		CommonModule,
		MatRadioModule,
		MatTreeModule,
		MatButtonToggleModule,
		PartialsModule,
		MaterialPreviewModule,
		FormsModule,
		ReactiveFormsModule,
		CodePreviewModule,
		HttpClientModule,
		NgbModule.forRoot(),
		RouterModule.forChild(routes),
	],
	exports: [RouterModule, AddMemberComponent, DealersCreateComponent],

	providers: [
		// MatIconRegistry,
		// { provide: MatBottomSheetRef, useValue: {} },
		{
			provide: MAT_BOTTOM_SHEET_DATA,
			useValue: {},
		},
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE],
		},
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
		{
			provide: MatPaginatorIntl,
			useClass: CustomMatPaginatorIntl,
		},
	],
	declarations: [
		DealersComponent,
		ManagerDealerComponent,
		DealersCreateComponent,
		AddMemberComponent,
	],
	bootstrap: [ManagerDealerComponent],
	entryComponents: [DealersCreateComponent, AddMemberComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ManagerDealersModule {}
