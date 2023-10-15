import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../helpers/custom-validators';
import * as moment from "moment"
import { map, Subscription } from 'rxjs';
import { ConditionsService } from '../services/conditions.service';
import {Condition} from "../intefaces/condition";

@Component({
  selector: 'form-diagnoses',
  templateUrl: './form-diagnoses.component.html',
  styleUrls: ['./form-diagnoses.component.scss']
})
export class FormDiagnosesComponent implements OnInit, OnDestroy {

  form!: FormGroup
  minDate!: moment.Moment
  conditions!: Condition[]
  result!: Condition[]
  textAreaJSON = ''
  formJSON =
  {
    encounter: {
      date : ""
    },
    conditions: [] as any
  }

  conditionsSubscription = Subscription.EMPTY

  constructor(

    private fb: FormBuilder,
    private conditionsService: ConditionsService,
  ) {
    this.minDate = moment();
    this.form = fb.group({
      date:['', CustomValidators.dateMinimum(this.minDate)],
      conditions: this.fb.array(
        [this.createDiagnosesGroup()],
      )
    })
  }

  ngOnInit() {
    this.conditionsSubscription = this.conditionsService.getConditions(`http://localhost:4001?Search=`,{
      IsPublic: true
    }).pipe(
      map(data => data.payload)
    ).subscribe(diagnoses => {
      this.conditions = diagnoses;
    })
  }

  ngOnDestroy() {
    this.conditionsSubscription.unsubscribe();
  }

  get diagnoses() {
    return this.form.get('conditions') as FormArray
  }

  createDiagnosesGroup() {
    return this.fb.group({
      condition: ['', Validators.required],
      note: [''],
    })
  }

  addDiagnose() {
    let fg = this.createDiagnosesGroup();
    this.diagnoses.push(fg);
  }

  onSubmit() {
    const data = this.conditions
    this.result = this.form.value.conditions.reduce((acc: any, curr: any, index: number) => {
      const currentCond = data.find(i => i.code == curr.condition.split(' ')[0]);
      const condObj = {
        id: this.conditionsService.setGUID(),
        context: {
          identifier: {
            type: {
              codding: [
                {
                  system: "eHealth/resources",
                  code: "encounter"
                }
              ]
            },
            value: currentCond!.id
          }
        },
        code: {
          coding: [
            {
              system: "eHealth/ICPC2/condition_codes",
              code: currentCond!.code
            }
          ]
        },
        notes: this.form.value.conditions[index].note,
        onset_date: moment().toISOString()
      }
      this.formJSON.conditions.push(condObj)
      acc.push(currentCond)

      return acc
    }, [] as Condition[]);

    this.formJSON.encounter.date = moment(this.minDate).toISOString();

    this.textAreaJSON = JSON.stringify(this.formJSON, undefined, 4)
  }
}
