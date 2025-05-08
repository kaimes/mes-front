<template>
  <div class="print-card">
    <div class="left-column">
      <div class="left-column-top">
        <div class="header-section">
          <div class="header-left">
            <p>(ML06)</p>
            <p>METALLURGICAL SERVICES</p>
            <p>SCUNTHORPE WORKS</p>
          </div>
          <div class="header-center">
            <p class="job-card-title">JOB CARD</p>
          </div>
          <div class="header-right">
            <p>{{ $filters.formatDate(job.completed_date, 'MM/DD/YY') }} TIME {{ $filters.formatDate(job.completed_date, 'HH:mm') }}</p>
          </div>
        </div>

        <div class="job-details-section">
          <div class="job-details-left">
            <div class="detail-row">
              <span class="label">JOB NUMBER</span>
              <span class="value">{{ job.code }}</span>
            </div>
            <div class="detail-row">
              <span class="label">***********</span>
              <span class="value">***********</span>
            </div>
            <div class="detail-row">
              <span class="label">QUALITY</span>
              <span class="value">{{ job.quality }}</span>
            </div>
            <div class="detail-row investigation-row">
              <span class="label">INVESTIGATION</span>
              <span class="value">{{ job.investigation }}</span>
            </div>
          </div>
          <div class="job-details-mid">
            <div class="detail-row">
              <span class="label">CAST</span>
              <span class="value">{{ job.cast }}</span>
            </div>
            <div class="detail-row">
              <span class="label">***********</span>
              <span class="value">***********</span>
            </div>
            <div class="detail-row">
              <span class="label">GRADE</span>
              <span class="value">RAIL</span>
            </div>
            <div class="detail-row">
              <span class="label"></span>
              <span class="value"></span>
            </div>
          </div>
          <div class="job-details-mid-right">
            <div class="detail-row">
              <span class="label">CODE/CUSTOMER</span>
              <span class="value">{{ job.customer }}</span>
            </div>
            <div class="detail-row">
              <span class="label"></span>
              <span class="value"></span>
            </div>
            <div class="detail-row">
              <span class="label">PRODUCT</span>
              <span class="value"><------ SIZES ------></span>
            </div>
            <div class="detail-row investigation-row">
              <span class="label">INVESTIGATOR</span>
              <span class="value">{{ job.investigator }}</span>
            </div>
          </div>
          <div class="job-details-right">
            <div class="detail-row">
              <span class="label">INITIATED</span>
              <span class="value">{{ $filters.formatDate(job.initiated_date, 'MM/DD/YY') }}</span>
            </div>
          </div>
        </div>

        <div class="additional-info-section">
          <p class="label">ADDITIONAL INFORMATION:</p>
          <div class="info-content">
          </div>
        </div>
      </div>

      <div class="left-column-bottom">
        <div class="signature-section">
          <span class="label">SIGNED</span>
          <span class="signature-line"></span>
        </div>
        <div class="status-grid">
          <div class="grid-row header-row">
            <span class="grid-cell priority-cell">PRIORITY</span>
            <span class="grid-cell workshop-cell">WORKSHOP</span>
            <span class="grid-cell mt-cell">M/T</span>
            <span class="grid-cell ht-cell">H/T</span>
            <span class="grid-cell polish-cell">M/POLISH</span>
          </div>
          <div class="grid-row">
            <span class="grid-cell label-cell">WORK RECEIVED</span>
            <span class="grid-cell dashed-cell">------------</span>
            <span class="grid-cell dashed-cell">---</span>
            <span class="grid-cell dashed-cell">---</span>
            <span class="grid-cell dashed-cell">---------</span>
          </div>
          <div class="grid-row">
            <span class="grid-cell label-cell">WORK COMPLETED</span>
            <span class="grid-cell dashed-cell">------------</span>
            <span class="grid-cell dashed-cell">---</span>
            <span class="grid-cell dashed-cell">---</span>
            <span class="grid-cell dashed-cell">---------</span>
          </div>
          <div class="grid-row">
            <span class="grid-cell label-cell">INITIALS</span>
            <span class="grid-cell dashed-cell">------------</span>
            <span class="grid-cell dashed-cell">---</span>
            <span class="grid-cell dashed-cell">---</span>
            <span class="grid-cell dashed-cell">---------</span>
          </div>
        </div>
      </div>
    </div>

    <div class="separator-column">
      <div class="fold-here-text">
        <span>F</span>
        <span>O</span>
        <span>L</span>
        <span>D</span>
        <br> <span>H</span>
        <span>E</span>
        <span>R</span>
        <span>E</span>
      </div>
    </div>

    <div class="right-column">
      <div class="sample-header">SAMPLE IDENTIFICATION AND ASSOCIATED TEST INFORMATION</div>
      <div class="sample-table-container">
        <table class="sample-table">
          <thead>
          <tr>
            <th>SAMPLE</th>
            <th>DECARB</th>
            <th>MICRO</th>
            <th>SULPHUR</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, nextTick, reactive, toRaw, toRefs} from "vue";

const props = defineProps({
  job: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

</script>

<style lang="scss" scoped>
// SCSS Variables
$font-family-monospace: monospace;
$base-font-size: 12px;
$text-color: #333;
$border-color-light: #ccc;
$border-color-dark: #555;
$border-color-visualize: #eee;
$dashed-border: 1px dashed $border-color-light;
$section-padding-bottom: 10px;
$section-margin-bottom: 10px;

.print-card {
  font-family: $font-family-monospace;
  border: 1px solid $border-color-light;
  padding: 15px;
  font-size: $base-font-size;
  line-height: 1.4;
  color: $text-color;
  display: flex;
  gap: 0;

  .left-column {
    flex: 1.5;
    display: flex;
    flex-direction: column;

    .left-column-top {
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: $section-padding-bottom;
        margin-bottom: $section-margin-bottom;
        border-bottom: $dashed-border;

        .header-left, .header-right {
          p {
            margin: 0 0 2px 0;
          }
        }

        .header-center {
          text-align: center;
          flex-grow: 1;

          .job-card-title {
            font-weight: bold;
            font-size: 1.2em;
            margin: 0;
          }
        }

        .header-right {
          text-align: right;
        }
      }

      .job-details-section {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-bottom: $section-padding-bottom;
        margin-bottom: $section-margin-bottom;
        border-bottom: $dashed-border;
        gap: 10px;

        .job-details-left, .job-details-mid, .job-details-mid-right, .job-details-right {
          display: flex;
          flex-direction: column;
          min-width: 130px;
        }

        .job-details-mid {
          padding-left: 10px;
        }

        .job-details-mid-right {
          padding-left: 10px;
        }

        .job-details-right {
          text-align: right;
          align-items: flex-end;
        }

        .detail-row {
          display: flex;
          margin-bottom: 3px;

          .label {
            display: inline-block;
            min-width: 75px;
            margin-right: 5px;
            font-weight: normal;
          }

          .value {
            font-weight: bold;
          }

          &.investigation-row .label {
            min-width: 90px;
          }
        }
      }

      .additional-info-section {
        margin-bottom: $section-margin-bottom;

        .label {
          margin-bottom: 5px;
        }

        .info-content {
          height: 100px;
          border: 1px dashed $border-color-visualize;
        }
      }
    }

    // .left-column-top end

    .left-column-bottom {
      padding-top: $section-padding-bottom;

      .signature-section {
        display: flex;
        align-items: flex-end;
        margin-bottom: 10px;

        .label {
          margin-right: 10px;
        }

        .signature-line {
          flex-grow: 1;
          text-align: center;
          border-bottom: $dashed-border;
        }
      }

      .status-grid {
        border: $dashed-border;
        display: table;
        width: 100%;
        table-layout: fixed;

        .grid-row {
          display: table-row;
          border-bottom: $dashed-border;

          &:last-child {
            border-bottom: none;
          }

          &.header-row .grid-cell {
            font-weight: normal;
          }

          .grid-cell {
            display: table-cell;
            padding: 3px 6px;
            text-align: center;
            border-left: $dashed-border;
            white-space: nowrap;
            vertical-align: middle;

            &:first-child {
              border-left: none;
              text-align: left;
            }

            /* Define explicit widths for grid cells */
            &.priority-cell {
              width: 18%;
            }

            &.workshop-cell {
              width: 18%;
            }

            &.mt-cell {
              width: 12%;
            }

            &.ht-cell {
              width: 12%;
            }

            &.polish-cell {
              width: 18%;
            }

            &.label-cell {
              width: 22%;
              text-align: left;
            }

            &.dashed-cell {
              text-align: center;
              letter-spacing: 1px;
            }
          }
        }
      }

      // .status-grid end
    }

    // .left-column-bottom end
  }

  // .left-column end

  .separator-column {
    width: 20px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      border-left: $dashed-border;
      transform: translateX(-50%);
    }

    .fold-here-text {
      text-orientation: mixed;
      font-size: 0.9em;
      letter-spacing: 2px;
      color: $border-color-dark;
      position: relative;
      background-color: #fff;
      padding: 5px 0;

      span { // Ensure letters stack vertically
        display: block; // Force each span onto a new line in vertical mode
        line-height: 1.1; // Adjust spacing between letters if needed
        text-align: center; // Center letter within its block space
      }

      br { // Style the break for visual spacing
        display: block; // Ensure it takes space
        content: ""; // .Needed for ::before/::after or display:block on br sometimes
        height: 20px;
      }
    }
  }

  // .separator-column end


  .right-column {
    flex: 1;
    display: flex;
    flex-direction: column;

    .sample-header {
      text-align: center;
      font-weight: bold;
      margin-bottom: 10px;
      letter-spacing: 1px;
      border-bottom: $dashed-border;
      padding-bottom: $section-padding-bottom;
    }

    .sample-table-container {
      flex-grow: 1;
      display: flex;
      border: 2px solid $border-color-dark;
      border-style: dashed solid solid dashed;
      position: relative;

      .sample-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;

        th, td {
          border-left: $dashed-border;
          border-bottom: $dashed-border;
          padding: 4px;
          text-align: center;
          height: 18px;

          &:first-child {
            border-left: none;
          }

          // Removed &:last-child rule that added space for hold-issue-label
        }

        th {
          font-weight: normal;
          border-bottom: 1px solid $border-color-dark;
          height: auto;
        }
      }

      // Removed .hold-issue-label { ... } styles
    }

    // .sample-table-container end
  }

  // .right-column end

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    flex-direction: column;
    max-width: 95%;
    .left-column {
      .left-column-top {
        margin-bottom: $section-margin-bottom * 2;
      }
    }
    .separator-column {
      width: 100%;
      height: 20px;
      margin: 10px 0;

      &::before {
        top: 50%;
        left: 0;
        right: 0;
        bottom: auto;
        border-left: none;
        border-top: $dashed-border;
        transform: translateY(-50%);
      }

      .fold-here-text {
        writing-mode: horizontal-tb;
        padding: 0 10px;

        span {
          display: inline;
          line-height: normal;
        }

        // Display letters inline
        br {
          display: inline;
          content: " ";
          margin: 0 3px;
        }

        // Make break a space
      }
    }
    .right-column {
      flex: 1;
    }
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 10px;
    .left-column {
      .left-column-bottom .status-grid {
        font-size: 10px;

        .grid-row .grid-cell {
          padding: 2px 4px;
        }
      }
    }
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 8px;
    .left-column .left-column-bottom .status-grid {
      font-size: 9px;

      .grid-row .grid-cell {
        padding: 1px 3px;
        white-space: normal;

        &.label-cell {
          width: 25%;
        }
      }
    }
  }

}

// .print-card end

@media print {
  @page {
    size: A5;
    margin: 10mm; // Adjust margins as needed
  }

  body {
    margin: 0;
    padding: 0;
  }

  // Hide elements outside the print card if necessary
  body > *:not(.print-card-wrapper), // Assuming a wrapper might exist
  body > *:not(.print-card) {
    // display: none; // Uncomment if elements outside the card are interfering
  }

  .print-card {
    border: none; // Remove screen border for printing
    padding: 0; // Remove screen padding for printing
    margin: 0;
    width: 100%;
    height: 100%; // Try to fit height
    font-size: 10pt; // Use points for print consistency, slightly smaller
    line-height: 1.2;
    page-break-inside: avoid; // Try to keep the card on one page
    color: #000; // Ensure black text for printing

    .left-column, .right-column {
      // Keep flex for now, adjust if columns wrap or overflow
    }

    .separator-column {
      display: none; // Hide the fold separator for printing
    }

    .left-column .left-column-top .additional-info-section .info-content {
      height: 100px; // Significantly reduce height
      border: 1px solid #ccc; // Keep a light border
    }

    .left-column .left-column-bottom .status-grid {
      .grid-cell {
         font-size: 9pt; // Make grid text smaller
         padding: 1px 3px; // Reduce padding
      }
      // Ensure borders are black for print
      border-color: #000;
      .grid-row, .grid-cell {
        border-color: #aaa;
      }
    }


    .right-column .sample-header {
       border-color: #aaa;
    }

    .right-column .sample-table-container {
      border: 1px solid #000; // Use a simpler solid border
      border-style: solid;
    }

    .right-column .sample-table {
      th, td {
        padding: 2px; // Reduce padding in table cells
        height: 14px; // Reduce row height significantly
        font-size: 9pt; // Make table text smaller
        border-color: #aaa; // Lighter border inside table
      }
      th {
         border-bottom-color: #000; // Header separator solid black
         height: auto;
      }
      td:empty {
         // Optional: Style empty cells differently if needed
         // background-color: #f8f8f8;
      }
    }

    // Ensure key sections don't break across pages
    .header-section, .job-details-section, .additional-info-section, .signature-section, .status-grid, .sample-header, .sample-table-container {
      page-break-inside: avoid;
    }
  }
}
</style>
