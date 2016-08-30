import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DetailedTargetingApiService } from '../detailed-targeting-api/detailed-targeting-api.service';
import { DetailedTargetingModeComponent } from '../detailed-targeting-mode/';
import { DetailedTargetingModeService } from '../detailed-targeting-mode/detailed-targeting-mode.service';
import { DetailedTargetingInputService } from './detailed-targeting-input.service';
import { DetailedTargetingInfoService } from '../detailed-targeting-info/detailed-targeting-info.service';
import { FORM_DIRECTIVES } from '@angular/forms';
import { DetailedTargetingSelectedService } from '../detailed-targeting-selected/detailed-targeting-selected.service';
import { DetailedTargetingItem } from '../detailed-targeting-item';

@Component({
  selector: 'detailed-targeting-input',
  templateUrl: 'detailed-targeting-input.component.html',
  styleUrls: ['detailed-targeting-input.component.css'],
  directives: [DetailedTargetingModeComponent, FORM_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailedTargetingInputComponent implements OnInit {
  private term;
  private mode;
  private hasFocus;
  private structuredSelectedItems;
  private activeInfo;

  /**
   * Trigger change detection mechanism that updates component's template
   */
  private updateTemplate () {
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  /**
   * On key up handler.
   * @param term
   */
  public keyup (term: string) {
    this.DetailedTargetingInputService.setTerm(term);
  }

  /**
   * Open dropdown with suggestions when gets focus
   */
  public focus () {
    this.hasFocus = true;
    this.DetailedTargetingModeService.set('suggested');
  }

  /**
   * Process focus lost
   */
  public blur () {
    this.hasFocus = false;
  }

  constructor (private DetailedTargetingApiService: DetailedTargetingApiService,
               private DetailedTargetingModeService: DetailedTargetingModeService,
               private DetailedTargetingInputService: DetailedTargetingInputService,
               private DetailedTargetingInfoService: DetailedTargetingInfoService,
               private DetailedTargetingSelectedService: DetailedTargetingSelectedService,
               private ref: ChangeDetectorRef) {
  }

  ngOnInit () {
    this.DetailedTargetingInputService.term
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((term: string) => {
        this.term = term;

        if (!term) {
          this.DetailedTargetingInfoService.update(null);
        } else {
          this.DetailedTargetingModeService.set('search');
          this.DetailedTargetingApiService.search(term);
        }

        this.updateTemplate();
      });

    this.DetailedTargetingModeService.mode
      .distinctUntilChanged()
      .subscribe(() => {
        this.DetailedTargetingInputService.setTerm('');
      });

    this.DetailedTargetingModeService.mode.subscribe((mode: string) => {
      this.mode = mode;

      this.updateTemplate();
    });

    this.DetailedTargetingSelectedService.items
      .map(this.DetailedTargetingSelectedService.structureSelectedItems)
      .subscribe((structuredSelectedItems) => {
        this.structuredSelectedItems = structuredSelectedItems;
        this.updateTemplate();
      });

    this.DetailedTargetingInfoService.item.subscribe((item: DetailedTargetingItem) => {
      this.activeInfo = Boolean(item);
      this.updateTemplate();
    });
  }

}
