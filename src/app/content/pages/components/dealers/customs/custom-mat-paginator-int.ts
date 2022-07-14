import { MatPaginatorIntl } from "@angular/material";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
	constructor() {
		super();

		this.getAndInitTranslations();
	}

	getAndInitTranslations() {
		this.itemsPerPageLabel = "Số lượng phần tử";
		this.nextPageLabel = "Trang tiếp theo";
		this.previousPageLabel = "Về trang trước";
		this.changes.next();
	}

	getRangeLabel = (page: number, pageSize: number, length: number) => {
		if (length === 0 || pageSize === 0) {
			return `0 / ${length}`;
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;
		const endIndex =
			startIndex < length
				? Math.min(startIndex + pageSize, length)
				: startIndex + pageSize;
		return `Page ${startIndex + 1} - ${endIndex} of ${length}`;
	};
}
