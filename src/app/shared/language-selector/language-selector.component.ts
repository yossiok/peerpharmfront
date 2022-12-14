import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  englishLang: Boolean = false;
  hebrewLang: Boolean = true;
  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
  }

  changeLanguage(type) {
    switch (type) {
      case "english":
        this.translate.use("en");
        this.hebrewLang = true;
        this.englishLang = false;
        break;
      case "hebrew":
        this.translate.use("he");
        this.englishLang = true;
        this.hebrewLang = false;
        break;
    }
  }
}
