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
  <dl class="metadata-table">
      <xsl:for-each select="xml_root/debug">
    <dt>Debug</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:for-each>
    <xsl:for-each select="//idinfo/citation/citeinfo/title">
    <xsl:if test="current()!=''">
    <dt>Dataset Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//idinfo/citation/citeinfo/origin">
          <xsl:if test="current()!=''">
              <dt>Originator</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//idinfo/citation/citeinfo/pubdate">
          <xsl:if test="current()!=''">
              <dt>Publish Date</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//idinfo/citation/citeinfo/othercit">
    <xsl:if test="current()!=''">
    <dt>Other Citation Information</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//idinfo/citation/citeinfo/geoform">
    <xsl:if test="current()!=''">
    <dt>Format of Geospatial Data</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/abstract">
    <xsl:if test="current()!=''">
    <dt>Abstract</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/purpose">
          <xsl:if test="current()!=''">
              <dt>Purpose</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/supplinf">
    <xsl:if test="current()!=''">
    <dt>Supplemental Information</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/begdate">
    <xsl:if test="current()!=''">
    <dt>Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/enddate">
    <xsl:if test="current()!=''">
    <dt>End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeperd/current">
          <xsl:if test="current()!=''">
              <dt>Currentness Reference</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
     </xsl:for-each>
     <xsl:for-each select="//status/progress">
          <xsl:if test="current()!=''">
              <dt>Progress</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
     </xsl:for-each>
     <xsl:for-each select="//status/update">
          <xsl:if test="current()!=''">
              <dt>Maintenance and Update Frequency</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
     </xsl:for-each>
      <xsl:for-each select="//spdom/descgeog">
          <xsl:if test="current()!=''">
              <dt>Description of Geographic Extent</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/westbc">
          <xsl:if test="current()!=''">
              <dt>West Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/eastbc">
          <xsl:if test="current()!=''">
              <dt>East Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/northbc">
          <xsl:if test="current()!=''">
              <dt>North Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdom/bounding/southbc">
          <xsl:if test="current()!=''">
              <dt>South Bounding Coordinate</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//keywords">
          <xsl:for-each select="theme">        
              <xsl:for-each select="themekt">
                  <xsl:if test="current()!=''">
                      <dt>Theme Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="themekey">
                  <xsl:if test="current()!=''">
                      <dt>Theme Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
          <xsl:for-each select="place">
              <xsl:for-each select="placekt">
                  <xsl:if test="current()!=''">
                      <dt>Place Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="placekey">
                  <xsl:if test="current()!=''">
                      <dt>Place Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
          <xsl:for-each select="stratum">
              <xsl:for-each select="stratkt">
                  <xsl:if test="current()!=''">
                      <dt>Stratum Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="stratkey">
                  <xsl:if test="current()!=''">
                      <dt>Stratum Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
          <xsl:for-each select="temporal">
              <xsl:for-each select="tempkt">
                  <xsl:if test="current()!=''">
                      <dt>Temporal Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
              <xsl:for-each select="tempkey">
                  <xsl:if test="current()!=''">
                      <dt>Temporal Keyword</dt><dd><xsl:value-of select="current()"/></dd>
                  </xsl:if>
              </xsl:for-each>
          </xsl:for-each>
      </xsl:for-each>
      <xsl:for-each select="//keywtax">      
          <xsl:for-each select="taxonkt">
              <xsl:if test="current()!=''">
                  <dt>Taxonomic Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="taxonkey">
              <xsl:if test="current()!=''">
                  <dt>Taxonomic Keyword</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
      </xsl:for-each>
      <xsl:for-each select="//taxonomy/taxonsys/classsys/classcit/citeinfo/title">
          <xsl:if test="current()!=''">
              <dt>Classification Citation Title</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//taxonomy/taxonsys/classsys/classcit/citeinfo/origin">
          <xsl:if test="current()!=''">
              <dt>Classification Citation Origin</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//taxonomy/taxonsys/classsys/classcit/citeinfo/pubdate">
          <xsl:if test="current()!=''">
              <dt>Classification Citation Publish Date</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//taxonomy/taxonsys/classsys/classcit/citeinfo/geoform">
          <xsl:if test="current()!=''">
              <dt>Classification Citation Form</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//taxonomy/taxonsys/taxonpro">
          <xsl:if test="current()!=''">
              <dt>Taxonomic Procedures</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//taxonomy/taxonsys/taxoncom">
          <xsl:if test="current()!=''">
              <dt>Taxonomic Completeness</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//taxoncl">
          <xsl:for-each select="taxonrn">
              <xsl:if test="current()!=''">
                  <dt>Taxonomic Rank Name</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="taxonrv">
              <xsl:if test="current()!=''">
                  <dt>Taxonomic Rank Value</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="common">
              <xsl:if test="current()!=''">
                  <dt>Common Name</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
          </xsl:for-each>
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
      <xsl:for-each select="//idinfo/secinfo/secsys">
          <xsl:if test="current()!=''">
              <dt>Security Classification System</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>       
      <xsl:for-each select="//idinfo/secinfo/secclass">
          <xsl:if test="current()!=''">
              <dt>Security Classification</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>       
      <xsl:for-each select="//idinfo/secinfo/sechandl">
          <xsl:if test="current()!=''">
              <dt>Security Handling Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>       
      <xsl:for-each select="//idinfo/native">
          <xsl:if test="current()!=''">
              <dt>Native Data Set Environment</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>       
      <xsl:for-each select="//dataqual/attracc/attraccr">
          <xsl:if test="current()!=''">
              <dt>Attribute Accuracy Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/logic">
          <xsl:if test="current()!=''">
              <dt>Logical Consistency Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/complete">
          <xsl:if test="current()!=''">
              <dt>Completeness Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/posacc/horizpa/horizpar">
          <xsl:if test="current()!=''">
              <dt>Horizontal Positional Accuracy Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//dataqual/posacc/vertacc/vertaccr">
          <xsl:if test="current()!=''">
              <dt>Vertical Positional Accuracy Report</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
       <xsl:for-each select="//method/methtype">
              <xsl:if test="current()!=''">
                  <dt>Methodology Type</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>          
       <xsl:for-each select="//method/methtype/methodid/methkt">
              <xsl:if test="current()!=''">
                  <dt>Method Keyword Thesaurus</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>
       <xsl:for-each select="//method/methtype/methodid/methkey">
              <xsl:if test="current()!=''">
                  <dt>Methodology Keyword</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>
       <xsl:for-each select="//method/methdesc">
              <xsl:if test="current()!=''">
                  <dt>Methodology Description</dt><dd><xsl:value-of select="current()"/></dd>
              </xsl:if>
       </xsl:for-each>
      <xsl:for-each select="//dataqual/lineage/procstep/procdesc">
          <xsl:if test="current()!=''">
              <dt>Process Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//dataqual/lineage/procstep/procdesc/procdate">
          <xsl:if test="current()!=''">
              <dt>Process Date</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each> 
      <xsl:for-each select="//dataqual/lineage/cloud">
          <xsl:if test="current()!=''">
              <dt>Cloud Cover</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdoinfo/indspref">
          <xsl:if test="current()!=''">
              <dt>Indirect Spatial Reference</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdoinfo/direct">
          <xsl:if test="current()!=''">
              <dt>Direct Spatial Reference Method</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>      
      <xsl:for-each select="//spdoinfo/rastinfo/rasttype">
          <xsl:if test="current()!=''">
              <dt>Raster Object Type</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdoinfo/rastinfo/rowcount">
          <xsl:if test="current()!=''">
              <dt>Row Count</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdoinfo/rastinfo/colcount">
          <xsl:if test="current()!=''">
              <dt>Column Count</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spdoinfo/rastinfo/vrtcount">
          <xsl:if test="current()!=''">
              <dt>Vertical Count</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/horizsys/geograph/latres">
          <xsl:if test="current()!=''">
              <dt>Latitude Resolution</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/horizsys/geograph/longres">
          <xsl:if test="current()!=''">
              <dt>Longitude Resolution</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
       <xsl:for-each select="//spref/horizsys/geograph/geogunit">
          <xsl:if test="current()!=''">
              <dt>Geographic Coordinate Units</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/horizsys/geodetic/horizdn">
          <xsl:if test="current()!=''">
              <dt>Horizontal Datum Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/horizsys/geodetic/ellips">
          <xsl:if test="current()!=''">
              <dt>Ellipsoid Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/horizsys/geodetic/semiaxis">
          <xsl:if test="current()!=''">
              <dt>Semi-major Axis</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/horizsys/geodetic/denflat">
          <xsl:if test="current()!=''">
              <dt>Denominator of Flattening Ratio</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/vertdef/altsys/altdatum">
          <xsl:if test="current()!=''">
              <dt>Altitude Datum Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/vertdef/altsys/altres">
          <xsl:if test="current()!=''">
              <dt>Altitude Resolution</dt><dd><xsl:value-of select="current()"/></dd>
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
      <xsl:for-each select="//spref/vertdef/depthsys/depthdn">
          <xsl:if test="current()!=''">
              <dt>Depth Datum Name</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/vertdef/depthsys/depthres">
          <xsl:if test="current()!=''">
              <dt>Depth Resolutin</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/vertdef/depthsys/depthdu">
          <xsl:if test="current()!=''">
              <dt>Depth Distance Units</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//spref/vertdef/depthsys/depthem">
          <xsl:if test="current()!=''">
              <dt>Depth Encoding Method</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//detailed/enttyp/enttypl">
          <xsl:if test="current()!=''">
              <dt>Entity Type Label</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//detailed/enttyp/enttypd">
          <xsl:if test="current()!=''">
              <dt>Entity Type Definition</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/enttyp/enttypds">
          <xsl:if test="current()!=''">
              <dt>Entity Type Definition Source</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl">
    <xsl:if test="current()!=''">
    <dt>Attribute Label</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdef">
    <xsl:if test="current()!=''">
    <dt>Attribute Definition</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdefs">
    <xsl:if test="current()!=''">
    <dt>Attribute Definition Source</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/edom/edomv">
    <xsl:if test="current()!=''">
    <dt>Enumerated domain Value</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/edom/edomvd">
    <xsl:if test="current()!=''">
        <dt>Enumerated domain Value Definition</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/attrlabl/attrdomv/edom/edomvs">
    <xsl:if test="current()!=''">
        <dt>Enumerated domain Value Definition Source</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr/begdatea">
    <xsl:if test="current()!=''">
    <dt>Beginning Date of Attribute Values</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
      <xsl:for-each select="//detailed/attr/enddatea">
          <xsl:if test="current()!=''">
              <dt>Ending Date of Attribute Values</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr/attrvai/attrva">
          <xsl:if test="current()!=''">
              <dt>Attribute Value Accuracy</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr/attrvai/attrvae">
          <xsl:if test="current()!=''">
              <dt>Attribute Value Accuracy Explanation</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//detailed/attr/attrmfrq">
          <xsl:if test="current()!=''">
              <dt>Attribute Measurement Frequency</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//overview/eaover">
          <xsl:if test="current()!=''">
              <dt>Entity and Attribute Overview</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//overview/eadetcit">
          <xsl:if test="current()!=''">
              <dt>Entity and Attribute Detail Citation</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
       <xsl:for-each select="//distinfo/distrib/cntinfo/cntperp/cntper">
          <xsl:if test="current()!=''">
              <dt>Distributor Contact Person</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distrib/cntinfo/cntaddr/addrtype">
          <xsl:if test="current()!=''">
              <dt>Address Type</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distrib/cntinfo/cntaddr/address">
          <xsl:if test="current()!=''">
              <dt>Address</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distrib/cntinfo/cntaddr/city">
          <xsl:if test="current()!=''">
              <dt>City</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distrib/cntinfo/cntaddr/state">
          <xsl:if test="current()!=''">
              <dt>State</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distrib/cntinfo/cntaddr/postal">
          <xsl:if test="current()!=''">
              <dt>Postal Code</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distrib/cntinfo/cntvoice">
          <xsl:if test="current()!=''">
              <dt>Phone</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distrib/cntinfo/cntemail">
          <xsl:if test="current()!=''">
              <dt>Email</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/resdesc">
          <xsl:if test="current()!=''">
              <dt>Resource Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/distlib">
          <xsl:if test="current()!=''">
              <dt>Distribution Liability</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/custom">
          <xsl:if test="current()!=''">
              <dt>Custom Order Process</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//distinfo/techpreq">
          <xsl:if test="current()!=''">
              <dt>Technical Prerequisites</dt><dd><xsl:value-of select="current()"/></dd>
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
    <dt>Metadata Contact Person</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntperp/cntorg">
    <xsl:if test="current()!=''">
    <dt>Metadata Contact Organization Name</dt><dd><xsl:value-of select="current()"/></dd>
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
      <xsl:for-each select="//metainfo/metac">
          <xsl:if test="current()!=''">
              <dt>Metadata Access Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metuc">
          <xsl:if test="current()!=''">
              <dt>Metadata Use Constraints</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metsi/metscs">
          <xsl:if test="current()!=''">
              <dt>Metadata Security Classification System</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metsi/metsc">
          <xsl:if test="current()!=''">
              <dt>Metadata Security Classification</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="//metainfo/metsi/metshd">
          <xsl:if test="current()!=''">
              <dt>Metadata Security Handling Description</dt><dd><xsl:value-of select="current()"/></dd>
          </xsl:if>
      </xsl:for-each>


  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet> 
