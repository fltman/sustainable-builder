# Klimat: climate projections for Kalmar (deep research notes)

Compiled 2026-10-08. Data file: `research/deep/klimat.json` (43 indicators).

## Main finding: SMHI has no SSP-based county figures yet

The brief asked for SMHI's newest SSP-based scenarios (SSP1-2.6, SSP2-4.5, SSP5-8.5) for Kalmar län. **They do not exist yet for temperature, precipitation, heat or drought.**

- SMHI's Klimatscenariotjänsten is the current service. It was launched in November 2021 and gained new download and map functions in August 2026. Its meteorological and hydrological parts still use **RCP2.6, RCP4.5 and RCP8.5** (EURO-CORDEX regional models, reference period 1971–2000). The method page says so explicitly ("scenarierna RCP2,6 och RCP4,5 och RCP8,5"); it was last updated 12 February 2026: https://www.smhi.se/klimat/framtidens-klimat/klimatscenariotjansten/om-klimatscenariotjansten/utslappsscenarier-och-klimatscenarier
- In the app code, `ssp1`, `ssp2` and `ssp5` appear only as *nutrient* scenarios for the Baltic Sea (oceanographic part).
- SMHI uses SSP only for sea level, which the baseline already covers.
- Länsstyrelsen Kalmar's climate adaptation page still links the 2015 RCP report (Klimatologi 26) and the 2020 plan. Kalmar kommun's Klimatanpassningsplan, updated 2025, also cites Klimatologi 26 (RCP8.5). Even Skåne's new plan for 2026–2030 uses SMHI RCP data for heat.

What I did instead:
1. **Replaced** the 2015 Klimatologi 26 numbers with the **2021 Klimatscenariotjänsten** numbers. These are newer and use a larger ensemble: 27/22/61 runs for RCP2.6/4.5/8.5. They use a newer reference period and include model-spread data.
2. **Mapped RCP to SSP** (RCP2.6 ≈ SSP1-2.6, RCP4.5 ≈ SSP2-4.5, RCP8.5 ≈ SSP5-8.5). IPCC AR6 WG1 Ch. 4 supports this: the assessed long-term SSP warming ranges "generally correspond to AR5 ranges for related scenarios" (https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-4/).
3. **Checked CMIP6 against CMIP5 for Northern Europe** using the IPCC AR6 Atlas regional data (see below). CMIP6/SSP runs warm Northern Europe about 0.3 °C more than CMIP5/RCP. This is used only to widen the upper uncertainty bound.
4. **Extended to 2126** using IPCC AR6 global projections to 2300 (pattern scaling, shown step by step below).

## Sources and how the numbers were read

### SMHI Klimatscenariotjänsten (open JSON behind the app)
The app at https://www.smhi.se/klimat/framtidens-klimat/klimatscenariotjansten/klimatscenariotjansten loads static JSON files. I found the URL patterns in the app's JavaScript bundle (`https://klimatsystem.smhi.se/klimatscenarier/DMDghNeo.js`):

- **Period means (met):** `https://www.smhi.se/pd/klimatsystem/climate_scenario/met/{ind}Anom/{rcp}/textdata/kalmar_lan_{ANN|DJF|JJA}_{2011_2040|2041_2070|2071_2100}.json`
  - `refGclim` = observed (gridded) mean for 1971–2000.
  - `refCordex` = the models' own mean for 1971–2000.
  - `absPeriodMean` = scenario mean for the period.
  - `change` = scenario mean minus `refCordex`.
- **Yearly series (met):** `.../met/{ind}Anom/{rcp}/graphs/{ind}Anom_{rcp}_ANN_yr_1951_2100_kalmar_lan.json`
  - `ensemble_mean` and `ensemble_perc_10_90` for each year, plus `obs_based` values up to 2018.
- **Hydrology box plots:** `.../hyd/{ind}Anom_unregulated/{rcp}/graphs/{ind}Anom_unregulated_{rcp}_ANN_{area}.json`
  - min, 25th percentile, median, mean, 75th percentile and max over **17 models** for each 30-year period.
  - Areas used: 292 = "Kalmar län kustområde", 171 = Ljungbyån.
- **Indicator definitions:** `.../met/textdata/indicatorData.json` and `.../hyd/textdata/indicatorData.json`.
- **Indicator codes:**

  | Code | Meaning |
  |---|---|
  | `tas` | annual mean temperature |
  | `su` | summer days, Tmax > 25 °C |
  | `csu` | longest run of summer days |
  | `tr` | tropical nights, Tmin > 20 °C |
  | `gsl`, `gsstart`, `gsend` | growing season length, start and end (daily mean > 5 °C) |
  | `fd` | frost days, Tmin < 0 °C |
  | `pr` | precipitation |
  | `r10mm`, `r20mm` | days with ≥ 10 mm and ≥ 20 mm |
  | `cdd` | longest dry spell |
  | `ddgt20`, `hd17` | cooling and heating degree days |
  | `smoistnodbm05` | days with soil moisture below 50 % of field capacity |
  | `wrun` | runoff |
  | `wdisyearmin` | mean annual low flow (MLQ) |
  | `wdisnodbm` | low-flow days |
  | `snowyearmax` | maximum snow water equivalent |
  | `cprc` | precipitation (hydrological ensemble) |
  | `ctmp` | air temperature (hydrological ensemble) |

- **No longer available:** max one-day precipitation (`rx1day`) and last spring frost are defined but have no files for Kalmar län. The old indicators "längsta värmebölja (dygnsmedel > 20 °C)" and "snow cover days" are gone.

### SMHI station observations
- **Normals:** the 1961–1990 and 1991–2020 files on the "Dataserier med normalvärden" pages.
  - I read the xlsx files in memory; nothing was saved.
  - Stations: Kalmar flygplats 66420 (temperature, growing season) and Kalmar D 66430 (precipitation).
- **Daily and monthly series:** SMHI open data API, `https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/{20|19|22}/station/66420/period/{corrected-archive|latest-months}/data.csv`. Parameter 20 is daily Tmax, 19 is daily Tmin, 22 is monthly mean.
  - The Kalmar flygplats series has a gap from October 1979 to March 1996.
  - Station-based counts therefore use complete years only: 1944–1979 and 1997–2025.

### Other sources
- **Klimatologi 47 (SMHI 2017):** short-duration rain (skyfall) statistics and climate factors.
- **SMHI skyfall page:** confirms the factors and the Svenskt Vatten minimum of 1.25. Kalmar län lies in region SÖ (checked on the region map on SMHI's kunskapsbanken page).
- **Folkhälsomyndigheten:**
  - the 2022 heatwave guidance (about 700 excess deaths in 2018);
  - the 2024 Tillsynsvägledning om temperatur inomhus (+10 % mortality per day at ≥ 26 °C for three days, another +10 % at ≥ 30 °C).
- **SGU:**
  - RR 2025:01, "grundvattenmagasinens robusthet och utsatthet för klimatförändringar", https://resource.sgu.se/dokument/publikation/rr/rr202501rapport/RR2501.pdf;
  - SMHI's summary page on groundwater in a warmer climate, https://www.smhi.se/klimat/framtidens-klimat/sjoar-och-vattendrag-i-varmare-klimat/grundvatten-i-varmare-klimat.
  - Both are qualitative for Kalmar; see below.
- **IPCC AR6 WG1:**
  - SPM B.1.1 and Table SPM.1 (GSAT 2081–2100 relative to 1850–1900: SSP1-2.6 1.8 [1.3–2.4], SSP2-4.5 2.7 [2.1–3.5], SSP5-8.5 4.4 [3.3–5.7] °C), https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/;
  - Ch. 4, Table 4.9 (GSAT in 2300, median and 5–95 %, assessed as *likely*: SSP1-2.6 1.5 [1.0–2.2], SSP2-4.5 3.3 [2.3–4.6], SSP5-8.5 9.6 [6.6–14.1] °C), https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-4/.
- **IPCC AR6 Atlas regional aggregates (GitHub, IPCC-WG1/Atlas, `datasets-aggregated-regionally/data/{CMIP5|CMIP6}/..._tas_land`):** monthly regional means per model. I read them in memory (about 30 MB); nothing was saved.

## Findings

### Observed: Kalmar is already about 1–2 °C warmer
| Measure | 1961–1990 | 1991–2020 | Recent |
|---|---|---|---|
| Annual mean temperature, Kalmar flygplats | 6.78 °C | 7.88 °C | 8.71 °C (2016–2025, own mean); 2020 record at 9.58 °C |
| Growing season (daily mean > 5 °C) | 203 days, starts about 18 April | 214 days, starts about 10 April | – |
| Annual precipitation, Kalmar D | 490 mm | 522 mm | – |
| Largest daily precipitation per year (mean) | 28.4 mm | 34.0 mm | – |
| Summer days (Tmax > 25 °C), Kalmar flygplats | 7.6 (1961–1979 only) | 13.5 (25 complete years) | 14.8 (1997–2025); 19.0 (2016–2025); 43 in 2018; 25 in 2026 up to 7 October |
| Days in ≥ 3-day runs with Tmax ≥ 26 °C (SMHI heat-message and FoHM threshold) | – | – | 6.5 days/yr, 1.3 episodes/yr (1997–2025); 21 of 29 years had at least one; 31 days in 2018 |
| Tropical nights | 0 | about 0.1 per year | 2 in 2018, 1 in 2021 |

The 2020 annual mean of 9.58 °C beats every year at the old town station 66430 (1859–1995, maximum 8.85 °C in 1934). That station runs about 0.4 °C *warmer* than the airport in the years both were measuring, so 2020 is very likely the warmest year in Kalmar's record.

### Projected: Kalmar län (SMHI, change from 1971–2000; RCP used as a proxy for SSP)
| Indicator | 1971–2000 | RCP2.6 2041–70 / 2071–2100 | RCP4.5 2041–70 / 2071–2100 | RCP8.5 2041–70 / 2071–2100 |
|---|---|---|---|---|
| Annual mean temperature (°C change) | 6.7 °C (obs) | +1.8 / +1.7 | +2.3 / +2.8 | +2.8 / +4.6 |
| Winter / summer temperature, 2071–2100 | −1.1 / 15.6 °C | +1.9 / +1.7 | +3.3 / +2.6 | +5.4 / +4.5 |
| Summer days (> 25 °C), absolute | 15.6 obs (14.8 model) | 27.3 / 26.9 | 31.9 / 35.1 | 36.0 / 56.7 |
| Longest run of summer days | 5.5 obs | 9.3 / 9.4 | 10.4 / 12.1 | 12.7 / 22.1 |
| Tropical nights | 0.0 | 0.4 / 0.5 | 0.7 / 1.1 | 1.4 / 5.4 |
| Growing season (days) | 204 | 238 / 238 | 250 / 266 | 265 / 304 |
| Growing season start (day of year) | 103 | 78 / 78 | 68 / 57 | 58 / 31 |
| Frost days | 128 | 98 / 99 | 86 / 78 | 79 / 52 |
| Precipitation (mm/month) | 48 obs (49 model) | 53 / 53 | 53 / 56 | 54 / 57 |
| Days ≥ 20 mm | 1.9 | 3.0 / 2.9 | 3.0 / 3.3 | 3.2 / 3.8 |
| Days with low soil moisture (change, coast) | – | +12 / +13 | +20 / +20 | +24 / +39 |
| Runoff (change, coast) | – | +3 % / +3 % | −1 % / +2 % | −1 % / −7 % |
| Maximum snow water equivalent (change, coast) | – | −28 % / −30 % | −47 % / −47 % | −50 % / −76 % |
| Low flow MLQ, Ljungbyån | – | −1 % / −3 % | −7 % / −3 % | −6 % / −12 % |
| Cooling degree days | 10 | 37 / 38 | 47 / 59 | 65 / 145 |
| Heating degree days | 3804 | 3316 / 3332 | 3134 / 2987 | 2996 / 2509 |

Model values for 2011–2040 (the "today" of the projections): +1.3 to +1.5 °C, about 24 summer days, 227–234 days of growing season and 101–107 frost days.

**Signals that barely change:** the longest dry spell (`cdd`, about 21 days in all scenarios) and the number of dry days (about 251 per year). The drought signal comes from **higher evaporation**, not less rain:
- more precipitation;
- lower soil moisture (−10 % on average under RCP8.5);
- more days with low soil moisture;
- less runoff and lower low flows.

Effective precipitation on the coast changes by −1.2 mm/month under RCP8.5 and +0.2 under RCP4.5, against a reference of 15.6 mm/month.

### Cloudbursts (skyfall)
- **Today, region SÖ:** the 1-hour 10-year rain is 22.6 ± 1.3 mm and the 1-hour 100-year rain is 38.3 ± 6.7 mm (3-hour 100-year rain: 53.5 ± 9.3 mm).
- **Climate factors:**

  | Period | RCP4.5 | RCP8.5 |
  |---|---|---|
  | 2011–2040 | 1.1 | 1.1 |
  | 2041–2070 | 1.15 | 1.2 |
  | 2071–2100 | 1.2 | 1.4 |

  The 1-hour values in the table are 21 % and 36 % for 2071–2100; SMHI's assessed factors are 20 % and 40 %.
- **Own estimate:** the 1-hour 100-year rain in 2071–2100 would be 38.3 × 1.4 = 53.6 mm (RCP8.5) or 38.3 × 1.2 = 46 mm (RCP4.5). The range 43–63.5 mm combines ±6.7 mm with factors of 1.36–1.41.

### Groundwater (SGU), qualitative only
For Götaland, SGU's 2024–2025 modelling projects:
- unchanged or less groundwater recharge;
- unchanged or lower levels;
- longer groundwater droughts.

The changes are larger under stronger scenarios and later periods. The biggest drop is in summer and autumn: recharge moves from spring to winter. SGU's 2015 study found that mean levels in large aquifers would rise in most of Sweden **except the southeast, where they fall**. SGU expects the largest losses "where and when use is greatest", which describes Kalmar län and Öland in summer. No Kalmar-specific figures are published in text form.

### Heat and health
- **Excess deaths in 2018:** about 700 in Sweden (FoHM 2022). SMHI cites 600–745 attributable to the heat. Most were elderly.
- **Mortality threshold:** mortality rises by about 10 % per day at ≥ 26 °C for three days, and another 10 % at ≥ 30 °C (FoHM 2024).
- **Exposure in Kalmar:** today about 6.5 days per year fall in such runs. Under RCP8.5 the longest run of summer days grows from 5.5 to 22 days by 2071–2100 (county average).
- **Not found:** no Kalmar-specific heat-mortality projection or heat-risk figure for the elderly was published.

## CMIP6 (SSP) against CMIP5 (RCP), Northern Europe (own calculation)
Source: IPCC AR6 Atlas regional aggregates, region NEU (land only). One run per model, as the Atlas provides. Change in annual mean temperature from 1971–2000, multi-model mean (median) [10th–90th percentile]:

| Period | CMIP5 RCP2.6 | CMIP6 SSP1-2.6 | CMIP5 RCP4.5 | CMIP6 SSP2-4.5 | CMIP5 RCP8.5 | CMIP6 SSP5-8.5 |
|---|---|---|---|---|---|---|
| 2041–2070 | 2.09 (1.98) | 2.17 (2.01) [1.00–3.28] | 2.52 (2.35) | 2.70 (2.57) [1.64–3.87] | 3.36 (2.97) | 3.49 (3.36) [2.26–5.02] |
| 2071–2100 | 2.00 (1.78) | 2.33 (2.15) [1.08–3.58] | 3.09 (2.99) | 3.42 (3.14) [2.05–4.91] | 5.23 (5.09) | 5.51 (5.05) [3.78–7.16] |

There are n = 21–29 CMIP5 models and 32–34 CMIP6 models.

What this shows:
- CMIP6 is about 0.3 °C warmer in the mean, but the medians are almost the same for SSP5-8.5.
- The mean ratios (CMIP6/CMIP5) for 2071–2100 are 1.165, 1.107 and 1.054.
- Kalmar län (SMHI EURO-CORDEX) warms *less* than the NEU land average, for example 4.6 against 5.2 °C under RCP8.5, because the coastal southeast warms less than northern Scandinavia.
- **Conclusion:** using SMHI's RCP numbers for the SSP worlds is reasonable. The CMIP6 uplift is added to the upper bound only.

## Extension to 2126 (own estimate, step by step)
1. **Kalmar län warming in 2081–2100.** I averaged SMHI's yearly ensemble means from the `tasAnom` graph files: RCP2.6 1.71, RCP4.5 2.89, RCP8.5 4.88 °C (from 1971–2000).
2. **Global warming in 2126 (method A).** I interpolated linearly between the AR6 best estimate for 2081–2100 (midpoint 2090.5) and the Table 4.9 median for 2300. The fraction is f = (2126 − 2090.5) / (2300 − 2090.5) = 0.1695.

   | Scenario | GSAT 2126 | Calculation | Ratio to 2081–2100 |
   |---|---|---|---|
   | SSP1-2.6 | 1.749 °C | 1.8 + (1.5 − 1.8)·f | 0.972 |
   | SSP2-4.5 | 2.802 °C | 2.7 + 0.6·f | 1.038 |
   | SSP5-8.5 | 5.281 °C | 4.4 + 5.2·f | 1.200 |
3. **Pattern scaling:** Kalmar(2126) = Kalmar(2081–2100) × ratio, giving **1.66 / 3.00 / 5.86 °C**.
4. **Method B (cross-check):** continuing SMHI's 2071–2097 ensemble-mean trend linearly to 2126 (+0.51 °C per decade under RCP8.5) gives 1.41 / 3.48 / 6.68 °C. Method A is used as the central value; B is used for the range.
5. **Range:**
   - The relative AR6 GSAT uncertainty is interpolated to 2126 the same way: 2081–2100 is *very likely* and 2300 is *likely*.
   - The relative bounds become 0.713–1.356 (SSP1-2.6), 0.764–1.313 (SSP2-4.5) and 0.739–1.325 (SSP5-8.5).
   - Low bound = min(A, B) × relative low. High bound = max(A, B, A × CMIP6 factor) × relative high.
   - Result: **SSP1-2.6 1.7 [1.0–2.6], SSP2-4.5 3.0 [2.3–4.6], SSP5-8.5 5.9 [4.3–8.9] °C** above 1971–2000.
   - Adding about 0.2–0.3 °C gives the change from the 1961–1990 station normal. These are the JSON values `temperaturokning_lan_2126_*`.
6. **Summer days in 2126:**
   - Fit to SMHI's (ΔT, Δsummer days) pairs through the origin: Δsu ≈ 4.77·ΔT + 0.94·ΔT². The fit is exact at 2.8 and 4.6 °C and about 1 day low at 1.75 °C.
   - With a model reference of 14.8 days: SSP2-4.5 38 [31–56] and SSP5-8.5 75 [53–131] summer days.
   - For SSP1-2.6 I used 26 [20–34]: the fit gives 25.3, and SMHI's own 2081–2100 value is 26.3.
   - The upper bound for SSP5-8.5 extrapolates well beyond SMHI's data.
7. **Other 2126 values for the model** (notes only, not in JSON; same ΔT, using roughly linear SMHI relations):
   - Growing season ≈ 204 + 21.7·ΔT days: SSP1-2.6 240 [226–261], SSP2-4.5 269 [254–303], SSP5-8.5 331 [298–365].
   - Change in low-soil-moisture days ≈ 8.5·ΔT (coast): +14 [9–22], +25 [19–39], +50 [37–75] days per year.

## Model implications
**Which model assumptions this can replace**
- **`W.stress` in src/data/levers.js** (now 0.4 / 0.7 / 1.0, ramped linearly to 2106 and up to ×1.2): in the model, stress is the *added* climate stress from 2026. Measured as warming beyond today's level (2011–2040 model mean +1.3/+1.5/+1.5 °C), the scenarios add:

  | Scenario | Warming 2026→2126 | Summer days | Low-soil-moisture days |
  |---|---|---|---|
  | SSP1-2.6 | +0.4 °C | about +2 | about +5 |
  | SSP2-4.5 | +1.5 °C | about +14 | about +18 |
  | SSP5-8.5 | +4.4 °C | about +51 | about +39 |

  Relative to SSP5-8.5 that is about 0.1 : 0.35 : 1 (heat and summer days) and 0.1 : 0.45 : 1 (drought). **Suggested:** stress = 0.15 / 0.4 / 1.0. Keep 0.15, not 0.1, for SSP1-2.6, because extremes already occur at today's level (2018).
- **Suggested time shape** (share of the 2126 stress reached; SMHI period means minus the 2011–2040 level, divided by the 2126 increment):

  | Scenario | By about 2055 | By about 2085 | By 2126 | Suggested curve |
  |---|---|---|---|---|
  | SSP1-2.6 | 1.0 (peak) | about 1.0 | 1.0 | `1-exp(-t/15)` (plateau from about 2050) |
  | SSP2-4.5 | about 0.55 | about 0.85 | 1.0 | `(t/100)^0.45` (rises early, then levels off) |
  | SSP5-8.5 | about 0.3 | about 0.6–0.7 | 1.0 | `t/100` (roughly linear; ends at 1.0 with no ×1.2 overshoot) |

  This replaces `clamp(t/80,0,1.2)`. With method B for SSP5-8.5 the share at 2085 is about 0.6; with method A it is about 0.7.
- **Baseline records to update:**
  - `temperaturokning_lan_rcp85` goes from 5 to 4.6 °C (now 2071–2100 against 1971–2000).
  - `varmebolja_langd_rcp85` is replaced by `langsta_hogsommarperiod_lan_2071_2100_rcp85` (22.1 days). The definition differs: consecutive days with Tmax > 25 °C, instead of daily mean > 20 °C.
  - `dagar_lag_markfuktighet_framtid` (40 days, absolute) is replaced by the change indicators +13 / +20 / +39 days. Adding the old "today about 15" gives roughly 28 / 35 / 54 days per year, but the reference periods differ.
  - The challenge text `varme_och_klimatstress` ("ca 5 °C", "drygt 20 dagar") should say "4,6 °C (RCP8.5, 2071–2100)" and "längsta period med högsommardygn 5 → 22 dygn".
- **Events:**
  - **Heat wave event** (`varmebolja_2044`): today about 1.3 heat episodes per year in Kalmar, and 21 of 29 years had at least one. By 2041–2070 summer days rise to about 32–36 per year (county), so a 2018-type summer stops being rare.
  - **Drought events:** use the change in low-soil-moisture days and the drop in Ljungbyån's low flow (−12 % under RCP8.5) as the hazard driver.
  - **Flood risk:** for flooding from rain rather than the sea, use a skyfall factor of 1.2 (SSP2-4.5) or 1.4 (SSP5-8.5) by 2085, and about 1.45–1.55 by 2126 under SSP5-8.5. The 2126 figure is my extrapolation, not published.
- **`cityVeg` and `foodRegional` (urban farming):** the growing season grows from about 214 days (Kalmar 1991–2020) to about 240 / 269 / 331 days by 2126, so a nearly year-round season under SSP5-8.5. But summer drought (more low-soil-moisture days, less runoff) means irrigation and water storage limit the gain. Frost days fall from 128 to 99 / 78 / 52 (2071–2100).
- **`water`:** the drought signal clearly scales with scenario. The model's `-.28*stress` term is consistent with this if stress is recalibrated as above.

**Uncertainty bands for the charts** (relative to the central change from 1971–2000):

| Period | Band | Basis |
|---|---|---|
| 2026–2070 | about −45 % / +45 % | 17-model spread for 2041–2070 RCP4.5 is 1.0–3.4 around 2.3; internal variability dominates |
| 2071–2100 | about −30 % / +25 % (SSP5-8.5); −40 % / +30 % (SSP2-4.5); −40 % / +50 % (SSP1-2.6) | Model min–max, see `range` in JSON |
| After 2100 | Lower side stays about −25 % to −40 %; upper side widens about 0.6 percentage points per year, from +25–30 % at 2085 to about +50 % at 2126 | AR6 changes its 2300 ranges from *very likely* to *likely* (wider: GSAT +47 % above the median for SSP5-8.5 in 2300, against +30 % in 2081–2100); plus the method spread (A against B, ±7–14 %) and the CMIP6 uplift (+5–17 %) |

The scenario spread is the largest uncertainty and is already represented by the three worlds. For count indicators (summer days, tropical nights), the bands should be wider and skewed upward, because they grow faster than linearly with temperature.

## Caveats
- **County, not city.** The SMHI projections are county averages on a 12 × 12 km grid. Coastal Kalmar has cooler summers than inland Småland: the station has about 15 summer days against 15.6 for the county grid in 1971–2000, and in 1961–1979 the station had only about 8. City values for summer days are probably lower than county values, while urban heat islands are not modelled at all.
- **Two different ensembles.** Temperature ranges come from the 17-model *hydrological* ensemble for the coastal area. Central values come from the 22–61-run *meteorological* ensemble. The means differ by up to 0.1 °C.
- **Ranges for meteorological counts** (summer days, growing season, frost days, tropical nights, days ≥ 20 mm) are the 2071–2100 mean of SMHI's *yearly* 10th and 90th ensemble percentiles. They include year-to-year variability and are wider than the spread of 30-year means. Read them as "a typical year lies within this range".
- **Station data.** Station counts (summer days, heat episodes, tropical nights) are my own counts from SMHI's quality-controlled data. The 2026 figures include preliminary data from the latest months. Kalmar flygplats has a 1979–1996 gap and the town station moved several times, so long-term trends at a single station are only indicative. The normal-period values are SMHI's own gap-filled normals.
- **Snow cover days.** Snow depth at Kalmar D has too many gaps (27 complete winters since 1987, only 4 in 1961–1990) for a reliable count. Snow cover days were not computed.

## Still missing
- **SSP-based county projections from SMHI.** These have not been published for any meteorological or hydrological indicator (status October 2026). Check Klimatscenariotjänsten again after the planned stakeholder consultations (Prio Klimatanpassning, October 2026).
- **Projected maximum one-day and 1-hour precipitation for Kalmar.** `rx1day` is not available per county in the current service. Only the national factors from Klimatologi 47 apply.
- **SGU groundwater figures for Kalmar.** SGU publishes these only as maps and open GIS data ("Grundvattentillgång i små magasin" and the climate indicators behind SGU RR 2025:01 and SGU-rapport 2024:04). The datasets would have to be downloaded; their size was not checked.
- **Heat-related mortality or morbidity projections** for Kalmar or for elderly people in the county.
- **Observed snow cover days** for Kalmar (see Caveats).
- **Gridded projections for Kalmar kommun.** SMHI's GIS grid downloads (new since August 2026) would allow a kommun-level cut instead of the county average. They would have to be downloaded; size not checked.
