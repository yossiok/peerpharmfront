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

  changeLanguage(type:string) {
    this.translate.use(type);
    localStorage.setItem("lang", type);
  }
}
