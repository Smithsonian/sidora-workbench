<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:mods="http://www.loc.gov/mods/v3" 
xmlns:fits="http://hul.harvard.edu/ois/xml/ns/fits/fits_output" 
xmlns:cpf="urn:isbn:1-931666-33-4" 
>

<xsl:template match="/">
  <html>
  <body>
  <xsl:for-each select="xml_root/general_info/label">
    <h1><xsl:value-of select="current()"/></h1>
  </xsl:for-each>
  <dl class="metadata-table">
      <xsl:for-each select="xml_root/debug">
    <dt>Debug</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:for-each>
    <xsl:for-each select="//mods:abstract">
    <xsl:if test="current()!=''">
    <dt>Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:subject/mods:topic">
    <xsl:if test="current()!=''">
    <dt>Topic</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:subject/mods:geographic">
    <xsl:if test="current()!=''">
    <dt>Geographic</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>

    <xsl:for-each select="//mods:mods/mods:name">
      <xsl:for-each select="mods:namePart">
        <xsl:if test="current()!=''">
        <dt>Name</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="mods:role/mods:roleTerm">
        <xsl:if test="current()!=''">
        <dt>Role</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
      </xsl:for-each>
    </xsl:for-each>
 <xsl:for-each select="//mods:identifier">
    <xsl:if test="current()!=''">
    <dt>Identifier</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:genre">
    <xsl:if test="current()!=''">
    <dt>Genre</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:note[not(@*)]">
    <xsl:if test="current()!=''">
    <dt>Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:originInfo/mods:dateCaptured">
    <xsl:if test="current()!=''">
    <dt>Date Captured</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:physicalLocation">
    <xsl:if test="current()!=''">
    <dt>Physical Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:copyInformation/mods:subLocation">
    <xsl:if test="current()!=''">
    <dt>Sub Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//fits:fileinfo/fits:created[@toolname='Exiftool']">
    <xsl:if test="current()!=''">
    <dt>Image Capture Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/title">
    <xsl:if test="current()!=''">
    <dt>Camera Site Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/othercit">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/origin">
    <xsl:if test="current()!=''">
    <dt>Originator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/geoform">
    <xsl:if test="current()!=''">
    <dt>Format of Geospatial Data</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/abstract">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/supplinf">
    <xsl:if test="current()!=''">
    <dt>Purposed Lat and Long</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/latres">
    <xsl:if test="current()!=''">
    <dt>Actual Latitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/longres">
    <xsl:if test="current()!=''">
    <dt>Actual Longitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/lineage/procstep[procdesc='Proposed Camera Deployment Begin Date']/procdate">
    <xsl:if test="current()!=''">
    <dt>Proposed Camera Deployment Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/lineage/procstep[procdesc='Proposed Camera Deployment End Date']/procdate">
    <xsl:if test="current()!=''">
    <dt>Proposed Camera Deployment End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/begdate">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/enddate">
    <xsl:if test="current()!=''">
    <dt>Camera Deployment End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Camera ID']/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Camera ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Image Resolution Setting']/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Image Resolution Setting</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Detection Distance']/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Detection Distance</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Sensitivity Setting']/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Sensitivity Setting</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Quiet Period Setting']/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Quiet Period Setting</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Camera Height']/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Camera Height</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl='Habitat Type']/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Habitat Type</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//theme/themekey">
    <xsl:if test="current()!=''">
    <dt>Theme Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//place/placekey">
    <xsl:if test="current()!=''">
    <dt>Place Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//keywtax/taxonkey">
    <xsl:if test="current()!=''">
    <dt>Taxonomic Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//taxoncl/taxonrn">
    <xsl:if test="current()!=''">
    <dt>Taxonomic Rank Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//taxoncl/taxonrv">
    <xsl:if test="current()!=''">
    <dt>Taxonomic Rank Value</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/accconst">
    <xsl:if test="current()!=''">
    <dt>Access Constraints</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/useconst">
    <xsl:if test="current()!=''">
    <dt>Use Constraints</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/datacred">
    <xsl:if test="current()!=''">
    <dt>Data Set Credit</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/complete">
    <xsl:if test="current()!=''">
    <dt>Camera Failure Details</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='Bait']/methodid/methkey">
    <xsl:if test="current()!=''">
    <dt>Bait Type</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='Bait']/methdesc">
    <xsl:if test="current()!=''">
    <dt>Bait Methodology</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='feature']/methodid/methkey">
    <xsl:if test="current()!=''">
    <dt>Feature</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype='feature']/methodid/methdesc">
    <xsl:if test="current()!=''">
    <dt>Feature Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/latres">
    <xsl:if test="current()!=''">
    <dt>Actual Latitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/longres">
    <xsl:if test="current()!=''">
    <dt>Actual Longitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/geogunit">
    <xsl:if test="current()!=''">
    <dt>Geographic Coordinate Units</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altdatum">
    <xsl:if test="current()!=''">
    <dt>Altitude Datum Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altres">
    <xsl:if test="current()!=''">
    <dt>Elevation</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altunits">
    <xsl:if test="current()!=''">
    <dt>Altitude Distace Units</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altenc">
    <xsl:if test="current()!=''">
    <dt>Altitude Encoding Method</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metd">
    <xsl:if test="current()!=''">
    <dt>Metadata Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metrd">
    <xsl:if test="current()!=''">
    <dt>Metadata Review Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metfrd">
    <xsl:if test="current()!=''">
    <dt>Metadata Future Review Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntperp/cntper">
    <xsl:if test="current()!=''">
    <dt>Contact Person</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntperp/cntorg">
    <xsl:if test="current()!=''">
    <dt>Organization Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/address">
    <xsl:if test="current()!=''">
    <dt>Address</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/city">
    <xsl:if test="current()!=''">
    <dt>City</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/state">
    <xsl:if test="current()!=''">
    <dt>State</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/postal">
    <xsl:if test="current()!=''">
    <dt>Postal Code</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntvoice">
    <xsl:if test="current()!=''">
    <dt>Phone</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntemail">
    <xsl:if test="current()!=''">
    <dt>Email</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metstdn">
    <xsl:if test="current()!=''">
    <dt>Metadata Standard Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metstdv">
    <xsl:if test="current()!=''">
    <dt>Metadata Standard Version</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type='']/mods:title">
    <xsl:if test="current()!=''">
    <dt>Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type='alternative']/mods:title">
    <xsl:if test="current()!=''">
    <dt>Alternative Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type='uniform']/mods:title">
    <xsl:if test="current()!=''">
    <dt>Uniform Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type='translated']/mods:title">
    <xsl:if test="current()!=''">
    <dt>Translated Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type='abbreviated']/mods:title">
    <xsl:if test="current()!=''">
    <dt>Abbreviated Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:identifier[not(@type)]">
    <xsl:if test="current()!=''">
    <dt>Item ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:identifier[@type='accessionNumber']">
    <xsl:if test="current()!=''">
    <dt>Accession / RU</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:role[mods:roleTerm = 'Creator']/../../mods:name/mods:namePart">
    <xsl:if test="current()!=''">
    <dt>Creator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:role[mods:roleTerm = 'Contributor']/../../mods:name/mods:namePart">
    <xsl:if test="current()!=''">
    <dt>Contributor</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:typeOfResource">
    <xsl:if test="current()!=''">
    <dt>Type of Resource</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:genre">
    <xsl:if test="current()!=''">
    <dt>Genre</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:abstract">
    <xsl:if test="current()!=''">
    <dt>Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther[@type='range' and not(@point)]">
    <xsl:if test="current()!=''">
    <dt>Date Range</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther[@point='start']">
    <xsl:if test="current()!=''">
    <dt>Start Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther[@point='end']">
    <xsl:if test="current()!=''">
    <dt>End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther/@qualifier">
    <xsl:if test="current()!=''">
    <dt>Date Qualifier</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:location/mods:physicalLocation">
    <xsl:if test="current()!=''">
    <dt>Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:shelfLocator">
    <xsl:if test="current()!=''">
    <dt>Shelf Locator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:url">
    <xsl:if test="current()!=''">
    <dt>URL</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subLocation">
    <xsl:if test="current()!=''">
    <dt>Sub Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:physicalDescription/mods:form">
    <xsl:if test="current()!=''">
    <dt>Physical Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordOrigin">
    <xsl:if test="current()!=''">
    <dt>Record Creator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordContentSource">
    <xsl:if test="current()!=''">
    <dt>Institute Creator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordCreationDate">
    <xsl:if test="current()!=''">
    <dt>Creation Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordChangeDate">
    <xsl:if test="current()!=''">
    <dt>Change Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:accessCondition">
    <xsl:if test="current()!=''">
    <dt>Access Condition</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:note">
    <xsl:if test="current()!=''">
    <dt>Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:topic">
    <xsl:if test="current()!=''">
    <dt>Topic</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:geographic">
    <xsl:if test="current()!=''">
    <dt>Geographic Subject</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:continent">
    <xsl:if test="current()!=''">
    <dt>Continent</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:country">
    <xsl:if test="current()!=''">
    <dt>Country</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:province">
    <xsl:if test="current()!=''">
    <dt>State</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:region">
    <xsl:if test="current()!=''">
    <dt>Region</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:county">
    <xsl:if test="current()!=''">
    <dt>County</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:city">
    <xsl:if test="current()!=''">
    <dt>City</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:citySection">
    <xsl:if test="current()!=''">
    <dt>City Section</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:cartographics/mods:coordinates">
    <xsl:if test="current()!=''">
    <dt>Coordinates</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type='conference']/mods:namePart">
    <xsl:if test="current()!=''">
    <dt>Expedition Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type='corporate' and @displayLabel='Vessel']/mods:namePart">
    <xsl:if test="current()!=''">
    <dt>Vessel Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type='corporate' and @displayLabel='Organization']/mods:namePart">
    <xsl:if test="current()!=''">
    <dt>Organization Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type='personal']/mods:namePart">
    <xsl:if test="current()!=''">
    <dt>Person Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:relatedItem/mods:titleInfo/mods:title">
    <xsl:if test="current()!=''">
    <dt>Related Collection Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:relatedItem/mods:identifier">
    <xsl:if test="current()!=''">
    <dt>Related Collection ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:language/mods:languageTerm[@type='text']">
    <xsl:if test="current()!=''">
    <dt>Language</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:language/mods:scriptTerm[@type='text']">
    <xsl:if test="current()!=''">
    <dt>Script</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:nameEntry[@localType='primary']/cpf:part">
    <xsl:if test="current()!=''">
    <dt>Project Name (Full)</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:nameEntry[@localType='abbreviation']/cpf:part">
    <xsl:if test="current()!=''">
    <dt>Project Name (Abbreviation)</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:function">
    <xsl:if test="current()!=''">
    <dt><xsl:value-of select="cpf:term"/></dt><dd><xsl:value-of select="cpf:descriptiveNote/cpf:p"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:existDates/cpf:dateRange/cpf:fromDate">
    <xsl:if test="current()!=''">
    <dt>Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:existDates/cpf:dateRange/cpf:toDate">
    <xsl:if test="current()!=''">
    <dt>End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:place/cpf:placeEntry[@localType='address']">
    <xsl:if test="current()!=''">
    <dt>Project Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:place/cpf:placeEntry[@localType='region']">
    <xsl:if test="current()!=''">
    <dt>Region</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>








  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 

