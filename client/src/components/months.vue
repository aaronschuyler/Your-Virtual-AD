<template>
  <div class="calendar">
    <table>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>
          <table>
            <tr>
              <td colspan="7">
                <a class="arrows" href="#!" @click="stepMonth('down')"> &lt; </a
                >{{ months[month] + " " + year
                }}<a class="arrows" href="#!" @click="stepMonth('up')">
                  &gt;
                </a>
              </td>
            </tr>
            <tr>
              <td>S</td>
              <td>M</td>
              <td>T</td>
              <td>W</td>
              <td>T</td>
              <td>F</td>
              <td>S</td>
            </tr>
            <tr v-for="(week, index) in calcDates(month, year)" :key="index">
              <td
                valign="top"
                :class="{
                  active:
                    selectedDate.getDate() +
                      '-' +
                      selectedDate.getMonth() +
                      '-' +
                      (selectedDate.getYear() + 1900) ==
                    date + '-' + month + '-' + year
                }"
                v-for="(date, index) in week"
                :key="index"
                @click="selectDate(date, month, year)"
              >
                {{ date }}<br />
                <span v-if="date">
                  <hr />
                  <span v-for="(post, indexx) in posts" :key="indexx">
                    <div
                      v-if="
                        post.getDate() +
                          '-' +
                          post.getMonth() +
                          '-' +
                          (post.getYear() + 1900) ==
                          date + '-' + month + '-' + year
                      "
                      class="bullet"
                    ></div> </span
                ></span>
              </td>
            </tr>
          </table>
        </td>
        <table>
          <tr>
            <td>
              {{
                months[selectedDate.getMonth()] +
                  " " +
                  selectedDate.getDay() +
                  ", " +
                  (selectedDate.getYear() + 1900)
              }}
            </td>
          </tr>
        </table>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Dates",
  data() {
    return {
      posts: [
        new Date(2019, 11, 3),
        new Date(2019, 11, 3),
        new Date(2019, 11, 7)
      ],
      now: new Date(),
      selectedDate: new Date(),
      month: new Date().getMonth(),
      year: new Date().getYear() + 1900,
      weeks: [],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    };
  },
  computed: {},
  methods: {
    stepMonth: function(d) {
      if (d == "up" && this.month <= 10) {
        this.month++;
      } else if (d == "down" && this.month > 0) {
        this.month--;
      } else if (d == "up" && this.month == 11) {
        this.month = 0;
        this.year++;
      } else if (d == "down" && this.month == 0) {
        this.month = 11;
        this.year--;
      }
    },
    selectDate: function(date, month, year) {
      this.selectedDate = new Date(year, month, date);
    },
    calcDates: function(month, year) {
      var start = 1;
      var weeks = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ];
      var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (
        this.year % 4 === 0 ||
        (this.year % 100 === 0 && this.year % 400 === 0)
      ) {
        months[1] = 29;
      }
      var firstDay = new Date();
      firstDay.setMonth(month);
      firstDay.setYear(year + 1900);
      firstDay.setDate(1);
      var beforeFirst = firstDay.getDay() - 1;
      if (beforeFirst == 8) beforeFirst = 0;
      for (var i = 0; i < 6; i++) {
        var multi = i * 7;
        for (var ii = 0; ii < 7; ii++) {
          if (multi == 0 && ii < beforeFirst) {
            weeks[i][ii] = "";
          } else if (start > months[month]) {
            weeks[i][ii] = "";
          } else {
            weeks[i][ii] = start;
            start++;
          }
        }
      }
      if (weeks[5][0] == 0) weeks.length = 5;
      return weeks;
    }
  }
};
</script>

<style>
/** .calendar {
        width: 60%;
        margin: auto;
    }

    .calendar table {
        margin: auto;
        text-align: center;
        width: 100%;
    }

    .calendar table table {
        width: 600px;
    }

    .calendar table table:nth-of-type(1) td {
        text-align: center;
        height: 50px;
        width: 50px;
        cursor: pointer;
        border: 1px solid #eee;
    }

    .arrows {
        color: white;
        font-weight: bolder;
    }

    .active {
        background-color: dodgerblue;
    }

    .active {
        color: white;
    }

    .bullet {
        height: 8px;
        width: 8px;
        background-color: orangered;
        border-radius: 50%;
        display: inline-block;
        margin: 5px;
    }**/
</style>
