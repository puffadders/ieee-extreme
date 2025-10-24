## Technical track

This folder contains the technical datasets and project files used for the project: elevation (DEM) tiles, rasters, vector boundaries, GCP & mapping CSVs, and a QGIS project.

Below is a short catalog of the files, suggested usage notes, and a few common GDAL/OGR/QGIS commands to help you view and process the data.

Contents
- Raster DEM / elevation files (.hgt, .tif, .vrt)
  - N00E033.hgt, N00E034.hgt, N00E035.hgt — SRTM HGT tiles covering the area.
  - S01E033.hgt, S01E034.hgt, S01E035.hgt, S02E033.hgt, S02E034.hgt, S02E035.hgt — additional HGT tiles (alternate downloads / naming).
  - S02E033_N00E035.vrt — a VRT (virtual mosaic) over some tiles (already prepared).
  - hb_dem.tif, hb.tif — GeoTIFF rasters (DEM or hillshade derivatives) for Homa Bay area.

- Vector / GIS boundaries (.shp and related files)
  - homa_bay_county.shp — Homa Bay county boundary (shapefile).
  - homa_bay_subdivisions_level2.shp — administrative subdivisions (level 2).
  - homa_bay_subdivisions_level3.shp — administrative subdivisions (level 3).
  - ken_admbnda_adm1_iebc_20191031.shp — Kenya admin boundaries.

- Project, metadata, documents
  - ke.qgz — QGIS project file that can be opened directly in QGIS.
  - hb_.pdf — PDF documentation or map export (open with a PDF viewer).

- Ground Control Points / mappings (CSV)
  - kenya_gcp_clean.csv, kenya_gcp_cleaned.csv, kenya_gcp_cleaned_joinable.csv, kenya_gcp_mapping.csv — CSVs with GCPs and mapping metadata. Useful for georeferencing or QA.

- Compressed / raw downloads
  - N00E035.SRTMGL1.hgt.zip — original downloaded zip for the N00E035 tile.

Notes & assumptions
- Most HGT files are SRTM in geographic coordinates (WGS84). If you need a particular CRS, reproject with GDAL (example below).
- Shapefiles here likely include the usual .shp/.shx/.dbf/.prj set in the same folder. The .prj will indicate the coordinate reference system.
- If a pre-built VRT exists (S02E033_N00E035.vrt), it can be used directly with most GDAL tools and QGIS without merging into a single file.

Quick tasks & example commands
Below are a few common operations you might want to run. These examples use GDAL/OGR command-line tools (gdalinfo, gdal_translate, gdalwarp, gdalbuildvrt, ogr2ogr). They are examples only — tweak paths and names as needed.

- Inspect a raster (get metadata and bounds):

  gdalinfo hb_dem.tif

- Build a VRT mosaic from HGT tiles (creates a lightweight virtual mosaic):

  gdalbuildvrt mosaic.vrt N00E033.hgt N00E034.hgt N00E035.hgt

  or to include all HGT tiles in the folder:

  gdalbuildvrt mosaic.vrt *.hgt

- Convert a VRT to a GeoTIFF (merge into a single raster):

  gdal_translate -of GTiff mosaic.vrt merged_dem.tif

- Reproject a raster to EPSG:4326 (if necessary) or to another CRS:

  gdalwarp -t_srs EPSG:4326 input.tif output_4326.tif

- Clip a raster to the Homa Bay county boundary (use the shapefile as cutline):

  gdalwarp -cutline homa_bay_county.shp -crop_to_cutline -dstnodata -9999 mosaic.vrt hb_clip_dem.tif

- Create a hillshade from a DEM:

  gdaldem hillshade merged_dem.tif hillshade.tif -z 1.0 -compute_edges

- Convert CSV of GCPs (lat/lon) to a point GeoPackage/shapefile (assumes header with lon/lat columns — adjust column names):

  ogr2ogr -f "GPKG" kenya_gcps.gpkg kenya_gcp_clean.csv -oo X_POSSIBLE_NAMES=lon -oo Y_POSSIBLE_NAMES=lat -oo KEEP_GEOMETRY=NO -nln kenya_gcps -a_srs EPSG:4326

- Load the QGIS project:

  Open `ke.qgz` in QGIS (it should reference many of the above raster and vector layers).

Tips and next steps
- If you plan to perform heavier raster processing (tiling, reprojection, resampling) use GDAL in a Python script with rasterio or the GDAL Python bindings to automate repeated steps.
- Validate CSV coordinate columns and projection before importing — mismatched coordinate axes are a common source of errors.
- If you want a single merged DEM tiled for fast access, consider creating a Cloud-Optimized GeoTIFF (COG) with gdal_translate --config GDAL_TIFF_OVR_BLOCKSIZE 512 -co TILED=YES -co COMPRESS=DEFLATE -co COPY_SRC_OVERVIEWS=YES.

Contact / provenance
- If you need the provenance for any tile (where it was downloaded from), check filenames (some include SRTMGL1 in the name) and the ZIPs that accompany them. Keep original zipped downloads if you need to re-extract.
