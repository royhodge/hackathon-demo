<template>
  <div>
    <div v-if="showMenu">
      <div v-on:click="changePost('register')">
        <md-card class="md-layout-item md-size-20 md-large-size-30 md-medium-size-40 md-small-size-60 md-xsmall-size-100 options" md-with-hover>
          <md-ripple>
            <md-card-header>
              <div class="md-title">Get A Pedigree's Records</div>
              <div class="md-subhead">Pull Registered Pedigree's Vaccination Records from IPFS/Blockchain</div>
            </md-card-header>
            <md-card-content>
            </md-card-content>
          </md-ripple>
        </md-card>
      </div>

      <div v-on:click="changePost('review')">
        <md-card class="md-layout-item md-size-20 md-large-size-30 md-medium-size-40 md-small-size-60 md-xsmall-size-100 options" md-with-hover>
          <md-ripple>
            <md-card-header>
              <div class="md-title">Get Vaccination Records</div>
              <div class="md-subhead">Retrieve All Signed/Unsigned Vaccination Records</div>
            </md-card-header>
            <md-card-content>
            </md-card-content>
          </md-ripple>
        </md-card>
      </div>

      <div v-on:click="changePost('procure')">
      </div>
    </div>

    <div v-if="showRegister">
      <md-table class="audit-table md-layout-item md-size-70 md-large-size-70 md-medium-size-80 md-small-size-90 md-xsmall-size-100" v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h2 class="md-title get-title">Get Pedigree Records</h2>
          </div>
            <md-field md-clearable class="md-toolbar-section-end search-bar">
              <md-input placeholder="Filter Records by Pedigree Name" v-model="search" @input="searchWithApi" />
            </md-field>
        </md-table-toolbar>
        <h2 class="loading" v-if="theBar">Loading Records...</h2>
        <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="theBar"></md-progress-bar>

        <div v-if="searched.length === 0">
          <h2 class="loading" v-if="theBar === false">We cannot find any records : (</h2>
        </div>

        <md-table-row slot="md-table-row" v-for="(se, i) in searched" :key="i">

          <md-table-cell md-label="No." md-numeric>{{ i + 1 }}</md-table-cell>
          <md-table-cell md-label="Code Name" md-sort-by="payload.inputs.SuperHero_CodeName">{{ se.payload.inputs.SuperHero_CodeName }}</md-table-cell>
          <md-table-cell md-label="Tag ID" md-sort-by="payload.inputs.SuperHero_TagID">{{ se.payload.inputs.SuperHero_TagID }}</md-table-cell>
          <md-table-cell md-label="Portfolio">
            <md-button class="md-icon-button" @click="queryRecord(se)"><md-icon>account_circle</md-icon></md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
        <md-tabs md-dynamic-height class="md-accent">
          <md-tab md-label="Basic Info">
            <div class="txn-details">
              <div class="md-subheading">Code Name: {{Pedigree_CodeName}}</div>
              <div class="md-subheading">Tag ID: {{Pedigree_TagID}}</div>
            </div>
          </md-tab>

          <md-tab md-label="Transaction">
            <div class="txn-details" v-if="showTxn">
              <md-field>
                <label>Transaction Hash</label>
                <md-input v-model="txnHash" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction From</label>
                <md-input v-model="txnFrom" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction To</label>
                <md-input v-model="txnTo" readonly></md-input>
              </md-field>
              <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
              <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
            </div>
            <div class="txn-details" v-else>
              <div class="md-caption">Please come back later</div>
              <br>
              <div class="md-caption">You should see the details then, if the transaction has been completed</div>
            </div>
          </md-tab>

          <md-tab md-label="BKC's Portrait">
            <div class="txn-details" v-if="showBundle">
              <img class="md-layout-item md-layout-item md-size-70 md-large-size-70 md-medium-size-80 md-small-size-80 md-xsmall-size-50" :src="imgData" alt="IMG"/>
              <md-field>
                <label>IPFS Bundle Hash</label>
                <md-input v-model="bundleHash" readonly></md-input>
              </md-field>
              <div class="md-caption">Image Name: <strong>{{imgName}}</strong></div>
              <div class="md-caption">Image Size: <strong>{{imgSize}}</strong> bytes</div>
            </div>
            <div class="txn-details" v-else>
              <div class="md-caption">Please wait...</div>
            </div>
          </md-tab>
        </md-tabs>

        <md-dialog-actions class="md-layout md-alignment-center-left">
          <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
        </md-dialog-actions>
      </md-dialog>
      <br>
    </div>

    <div v-if="showReview">
      <md-table class="audit-table md-layout-item md-size-70 md-large-size-70 md-medium-size-80 md-small-size-90 md-xsmall-size-100" v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h2 class="md-title get-title">Get Pedigree Reviews</h2>
          </div>
            <md-field md-clearable class="md-toolbar-section-end search-bar">
              <md-input placeholder="Filter Records by Job-to-Do" v-model="search" @input="searchWithApi" />
            </md-field>
        </md-table-toolbar>
        <h2 class="loading" v-if="theBar">Loading Records...</h2>
        <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="theBar"></md-progress-bar>

        <div v-if="searched.length === 0">
          <h2 class="loading" v-if="theBar === false">We cannot find any records : (</h2>
        </div>

        <md-table-row slot="md-table-row" v-for="(se, i) in searched" :key="i">

          <md-table-cell md-label="No." md-numeric>{{ i + 1 }}</md-table-cell>
          <md-table-cell md-label="Pedigree Manager" md-sort-by="payload.inputs.Pedigree_Manager">{{ se.payload.inputs.Pedigree_Manager }}</md-table-cell>
          <md-table-cell md-label="Tag ID" md-sort-by="payload.inputs.Pedigree_TagID">{{ se.payload.inputs.Pedigree_TagID }}</md-table-cell>
          <md-table-cell md-label="Job-to-Do" md-sort-by="payload.inputs.Job_To_Do">{{ se.payload.inputs.Job_To_Do }}</md-table-cell>
          <md-table-cell md-label="Details">
            <md-button class="md-icon-button" @click="queryRecord(se)"><md-icon>assignment_ind</md-icon></md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
        <md-tabs md-dynamic-height class="md-accent">
          <md-tab md-label="Basic Info">
            <div class="txn-details">
              <div class="md-subheading">Tag ID: {{Pedigree_TagID}}</div>
              <div class="md-subheading">Manager: {{Pedigree_Manager}}</div>
              <div class="md-subheading">Job-to-Do: {{Job_To_Do}}</div>
              <div class="md-subheading">Date Reviewed: {{Date_Reviewed}}</div>
              <div class="md-subheading">Comments: {{Review_Comments}}</div>
            </div>
          </md-tab>

          <md-tab md-label="Transaction">
            <div class="txn-details" v-if="showTxn">
              <md-field>
                <label>Transaction Hash</label>
                <md-input v-model="txnHash" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction From</label>
                <md-input v-model="txnFrom" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction To</label>
                <md-input v-model="txnTo" readonly></md-input>
              </md-field>
              <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
              <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
            </div>
            <div class="txn-details" v-else>
              <div class="md-caption">Please come back later</div>
              <br>
              <div class="md-caption">You should see the details then, if the transaction has been completed</div>
            </div>
          </md-tab>

        </md-tabs>

        <md-dialog-actions class="md-layout md-alignment-center-left">
          <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
        </md-dialog-actions>
      </md-dialog>
      <br>
    </div>

    <div v-if="showProcure">
      <md-table class="audit-table md-layout-item md-size-70 md-large-size-70 md-medium-size-80 md-small-size-90 md-xsmall-size-100" v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h2 class="md-title get-title">Get Pedigree Records</h2>
          </div>
            <md-field md-clearable class="md-toolbar-section-end search-bar">
              <md-input placeholder="Filter Records by Manager" v-model="search" @input="searchWithApi" />
            </md-field>
        </md-table-toolbar>
        <h2 class="loading" v-if="theBar">Loading Records...</h2>
        <md-progress-bar class="md-accent" md-mode="indeterminate" v-if="theBar"></md-progress-bar>

        <div v-if="searched.length === 0">
          <h2 class="loading" v-if="theBar === false">We cannot find any records : (</h2>
        </div>

        <md-table-row slot="md-table-row" v-for="(se, i) in searched" :key="i">

          <md-table-cell md-label="No." md-numeric>{{ i + 1 }}</md-table-cell>
          <md-table-cell md-label="Pedigree Manager" md-sort-by="payload.inputs.Pedigree_Manager">{{ se.payload.inputs.Pedigree_Manager }}</md-table-cell>
          <md-table-cell md-label="Tag ID" md-sort-by="payload.inputs.Pedigree_TagID">{{ se.payload.inputs.Pedigree_TagID }}</md-table-cell>
          <md-table-cell md-label="Job-to-Do" md-sort-by="payload.inputs.Job_To_Do">{{ se.payload.inputs.Job_To_Do }}</md-table-cell>
          <md-table-cell md-label="Details">
            <md-button class="md-icon-button" @click="queryRecord(se)"><md-icon>work</md-icon></md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>

      <md-dialog class="detailsDialog" :md-active.sync="showDetailsDialog">
        <md-tabs md-dynamic-height class="md-accent">
          <md-tab md-label="Basic Info">
            <div class="txn-details">
              <div class="md-subheading">Tag ID: {{Pedigree_TagID}}</div>
              <div class="md-subheading">New Manager: {{Pedigree_Manager}}</div>
              <div class="md-subheading">Job-to-Do: {{Job_To_Do}}</div>
              <div class="md-subheading">Date Procured: {{Date_Procured}}</div>
            </div>
          </md-tab>

          <md-tab md-label="Transaction">
            <div class="txn-details" v-if="showTxn">
              <md-field>
                <label>Transaction Hash</label>
                <md-input v-model="txnHash" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction From</label>
                <md-input v-model="txnFrom" readonly></md-input>
              </md-field>
              <md-field>
                <label>Transaction To</label>
                <md-input v-model="txnTo" readonly></md-input>
              </md-field>
              <div class="md-caption">Transaction Status: <strong>{{txnStatus}}</strong></div>
              <div class="md-caption">Gas Used: <strong>{{gasUsed}}</strong></div>
            </div>
            <div class="txn-details" v-else>
              <div class="md-caption">Please come back later.</div>
              <br>
              <div class="md-caption">You should see the details then, if the transaction has been completed.</div>
            </div>
          </md-tab>

        </md-tabs>

        <md-dialog-actions class="md-layout md-alignment-center-left">
          <md-button class="md-accent" @click="showDetailsDialog = false">OK</md-button>
        </md-dialog-actions>
      </md-dialog>
      <br>
    </div>

  </div>
</template>

<script>
import simbaApi from './gateways/simba-api'

export default {
  name: 'Get',
  data: () => ({
    showRegister: false,
    showReview: false,
    showProcure: false,
    showMenu: true,
    showTxn: false,
    showBundle: false,
    search: null,

    searched: [],
    showDetailsDialog: false,
    theBar: true,
    apiSearch: false,

    Pedigree_CodeName: null,
    Pedigree_TagID: null,
    Pedigree_Manager: null,
    Job_To_Do: null,
    Date_Reviewed: null,
    Review_Comments: null,
    Date_Procured: null,

    txnFrom: null,
    txnTo: null,
    txnHash: null,
    txnStatus: null,
    gasUsed: null,

    bundleHash: null,
    imgSize: null,
    imgName: null,
    imgData: null
  }),
  methods: {
    changePost: function (post) {
      switch (post) {
        case 'register':
          this.showRegister = true
          this.showReview = false
          this.showProcure = false
          this.showMenu = false
          this.getRecords()
          break
        case 'review':
          this.showRegister = false
          this.showReview = true
          this.showProcure = false
          this.showMenu = false
          this.getRecords()
          break
        case 'procure':
          this.showRegister = false
          this.showReview = false
          this.showProcure = true
          this.showMenu = false
          this.getRecords()
          break
        case 'menu':
          this.showRegister = false
          this.showReview = false
          this.showProcure = false
          this.showMenu = true
          break
      }
    },
    queryRecord (res) {
      this.showDetailsDialog = true
      this.setBasic(res.payload.inputs)
      this.setTxn(res.id)
      if (this.showRegister) {
        this.cleanBundleInfo()
        this.setFileBundle(res.id)
      }
    },
    setBasic (obj) {
      if (this.showRegister) {
        this.Pedigree_CodeName = obj.Pedigree_CodeName
        this.Pedigree_TagID = obj.Pedigree_TagID
      }
      if (this.showReview) {
        this.Pedigree_TagID = obj.Pedigree_TagID
        this.Pedigree_Manager = obj.Pedigree_Manager
        this.Job_To_Do = obj.Job_To_Do
        this.Date_Reviewed = (new Date(obj.Date_Reviewed))
        this.Review_Comments = obj.Review_Comments
      }
      if (this.showProcure) {
        this.Pedigree_TagID = obj.Pedigree_TagID
        this.Pedigree_Manager = obj.Pedigree_Manager
        this.Job_To_Do = obj.Job_To_Do
        this.Date_Procured = (new Date(obj.Date_Procured))
        this.Review_Comments = obj.Review_Comments
      }
    },
    setTxn (id) {
      let self = this
      try {
        simbaApi.getData('transaction/' + id + '/')
          .then(function (res) {
            if (res.data.receipt == null) {
              self.showTxn = false
            } else {
              self.showTxn = true
              self.txnFrom = res.data.receipt.from
              self.txnTo = res.data.receipt.to
              self.txnHash = res.data.receipt.transactionHash
              self.txnStatus = res.data.receipt.status
              self.gasUsed = res.data.receipt.gasUsed
            }
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    cleanBundleInfo () {
      this.showBundle = false
      this.bundleHash = null
      this.imgSize = null
      this.imgName = null
      this.imgData = null
    },
    setFileBundle (id) {
      if (id == null) {
        return
      }
      let self = this
      try {
        simbaApi.getData('transaction/' + id + '/bundle/')
          .then(function (res) {
            if (res) {
              self.showBundle = true
              self.bundleHash = res.data.bundle_hash
              self.imgSize = res.data.manifest[0].size
              self.imgName = res.data.manifest[0].name
              self.imgData = 'data:image/png;base64, ' + res.data.manifest[0].data
            } else {
              self.showBundle = false
            }
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    searchWithApi () {
      let self = this
      if (this.search) {
        this.apiSearch = true
      } else {
        this.apiSearch = false
      }
      let method = null
      if (this.showRegister) {
        method = 'Register_Pedigree/?Pedigree_CodeName_contains='
      }
      if (this.showReview) {
        method = 'Review_Pedigree/?Job_To_Do_contains='
      }
      if (this.showProcure) {
        method = 'Procure_Pedigree_Service/?Pedigree_Manager_contains='
      }
      try {
        simbaApi.getData(method + this.search)
          .then(function (response) {
            self.searched = response.data.results
            self.apiSearch = false
          })
      } catch (e) {
        this.errors.push(e)
      }
    },
    getRecords (e) {
      let method = null
      if (this.showRegister) {
        method = 'Register_Pedigree/?no_page=1/'
      }
      if (this.showReview) {
        method = 'Review_Pedigree/?no_page=1/'
      }
      if (this.showProcure) {
        method = 'Procure_Pedigree_Service/?no_page=1/'
      }
      let self = this
      try {
        simbaApi.getData(method)
          .then(function (response) {
            self.theBar = false
            self.searched = response.data.results
          })
      } catch (e) {
        this.errors.push(e)
      }
    }
  }
}
</script>

<style scoped>
  .my-card {
    margin-top: 40px;
    width: 300px;
    display: inline-block;
    vertical-align: top;
    margin-bottom: 20px;
  }
  .detailsDialog {
    max-width: 600px;
  }
  .txn-details {
    margin: 15px;
  }
  .get-title {
    margin: 20px;
  }
  .options {
    margin-top: 40px;
  }
  .audit-table  {
    margin-top: 40px;
    height: 550px;
  }
  .md-field {
    max-width: 300px;
  }
  .md-progress-bar {
    margin: 24px;
  }
  .loading {
    text-align: center;
  }
  .dialog {
    min-height: 400px;
  }
  .break {
    word-break: break-all;
  }
  .api-bar {
    margin-top: -18px;
  }
  .search-bar {
    margin-left: 15px;
    margin-top: -10px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
</style>
