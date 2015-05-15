<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    >

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="SIdoraConcept">
        <html>
            <body>                
                <dl class="metadata-table"></dl>
            </body>
        </html>
        <xsl:for-each select="conceptType">
            <dt>Concept Type: <xsl:value-of select="current()"/></dt>
            
        </xsl:for-each>
        
        <xsl:for-each select="primaryTitle">
            <dt>Primary Title:</dt>
            <xsl:call-template name="formatTitle"/>
            
        </xsl:for-each>
        
        <xsl:for-each select="altTitle">
            <xsl:if test="current()!=''">
                <dt><xsl:text>Alternate Title: </xsl:text>
                    <xsl:if test="@type != ''">
                        <xsl:value-of select="@type"/>
                    </xsl:if></dt>
                <xsl:call-template name="formatTitle"/>
                
            </xsl:if>  
        </xsl:for-each>
        
        <xsl:for-each select="summaryDescription">
            <xsl:if test="current()!=''">
                <dt><xsl:text>Summary Description: </xsl:text></dt>
                <dd><xsl:value-of select="."/></dd>            
                
            </xsl:if>  
        </xsl:for-each>
        
        <xsl:for-each select="keyword">
            <xsl:if test="current()!='' and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Keyword Type'"/>
                </xsl:call-template>
                <xsl:if test="@scheme!=''">
                    <dd><xsl:text>Keyword Thesaurus: </xsl:text>
                        <xsl:value-of select="@scheme"/>
                    </dd>
                </xsl:if> 
            </xsl:if>  
        </xsl:for-each>
        
        <xsl:for-each select="entityType">   

                <xsl:if test="@type!='' or value != ''or note != ''">
                    <dt><xsl:text>Entity Type: </xsl:text>
                        <xsl:value-of select="@type"/>        </dt>
                </xsl:if>
                <xsl:for-each select="value">
                    <xsl:if test="current() != ''">
                        <dd><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each>
                <xsl:for-each select="note">
                    <xsl:if test="current() != ''">
                        <dd><xsl:text>Note: </xsl:text><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each>  
        </xsl:for-each>
               
        <xsl:for-each select="identifier">   
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Identifier'"/>
                </xsl:call-template>
                
            </xsl:if>  
        </xsl:for-each>
        
        <xsl:for-each select="rights">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Rights'"/>
                </xsl:call-template>
                
            </xsl:if>  
        </xsl:for-each>
        
        <xsl:for-each select="source">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Source'"/>
                </xsl:call-template>    
                
            </xsl:if>        
        </xsl:for-each>
        
        <xsl:for-each select="relationship">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Relationship'"/>
                </xsl:call-template>
                
            </xsl:if>  
        </xsl:for-each>
        
        <xsl:for-each select="note">
            <xsl:if test="current()!=''">
                <dt><xsl:text>Note: </xsl:text>
                    <xsl:if test="@type != ''">
                       <xsl:value-of select="@type"/>
                    </xsl:if>
                </dt>
                <dd><xsl:value-of select="."/></dd> 
            </xsl:if>        
        </xsl:for-each>
        
        
        <xsl:for-each select="timePeriod"> 
            <xsl:if test="current() !=''">
                    <dt>
                        <xsl:text>Time Period: </xsl:text>              
                    <xsl:call-template name="formatTime"/>    
                    </dt>
                
            </xsl:if>
        </xsl:for-each> 
     
        <xsl:for-each select="place">  
            <xsl:if test="current() !=''">
            <dt><xsl:text>Place: </xsl:text>                
                <xsl:if test="@type != ''">
                    <xsl:value-of select="@type"/>
                </xsl:if>
            </dt>
            </xsl:if>
            <xsl:call-template name="formatPlace"/>
            
            <xsl:for-each select="note">
                <xsl:if test="current() != ''">
                    <dd><xsl:text>Place Note: </xsl:text><xsl:value-of select="."/></dd>                   
                </xsl:if>
            </xsl:for-each> 
        </xsl:for-each> 
     
        <xsl:for-each select="actor">
            <xsl:if test="current()!=''">
                <dt><xsl:text>Actor: </xsl:text>
                    <xsl:if test="@role != ''">
                        <xsl:value-of select="@role"/>
                    </xsl:if></dt>
                <xsl:call-template name="formatActor"/>
                <xsl:for-each select="persname/contactInfo"> 
                    <xsl:call-template name="formatContactInfo"></xsl:call-template>
                </xsl:for-each>
                <xsl:for-each select="contactInfo">
                    <xsl:call-template name="formatContactInfo"></xsl:call-template>
                </xsl:for-each>
            </xsl:if>               
        </xsl:for-each>  

        <xsl:for-each select="language">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <dt><xsl:text>Language: </xsl:text></dt>
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Language'"/>
                </xsl:call-template>   
            </xsl:if>        
        </xsl:for-each>
              
        <xsl:for-each select="physDesc">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Physical Description'"/>
                </xsl:call-template>
             
            </xsl:if>        
        </xsl:for-each>

        <xsl:for-each select="condition">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Condition'"/>
                </xsl:call-template>
             
            </xsl:if>        
        </xsl:for-each>
       
        <xsl:for-each select="context">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Context'"/>
                </xsl:call-template>
           
            </xsl:if>        
        </xsl:for-each> 
        
        <xsl:for-each select="style">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Style'"/>
                </xsl:call-template>
             
            </xsl:if>        
        </xsl:for-each>  

        
        <xsl:for-each select="format">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Format'"/>
                </xsl:call-template>
           
            </xsl:if>        
        </xsl:for-each>
        
        <xsl:for-each select="materials">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Materials'"/>
                </xsl:call-template>
          
            </xsl:if>        
        </xsl:for-each>
        
        <xsl:for-each select="method">
            <xsl:if test="@type !=''">
                <dt><xsl:text>Method Type:  </xsl:text><xsl:value-of select="@type"/></dt>
            </xsl:if>
                <xsl:if test="p !=''">
                <dd>Method Description:  <xsl:value-of select="p"/></dd>
                </xsl:if>
            <xsl:if test="note != ''">
                <dd>Notes:  <xsl:value-of select="note"/></dd>
          
            </xsl:if>        
        </xsl:for-each>
        
        <xsl:for-each select="technique">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Technique'"/>
                </xsl:call-template> 
            
            </xsl:if>        
        </xsl:for-each>
        
        <xsl:for-each select="treatment">
            <xsl:if test="current()!=''  and (value !='' or note != '')">
                <xsl:call-template name="formatTypeValueNote">
                    <xsl:with-param name="text" select="'Treatment'"/>
                </xsl:call-template>    
               
            </xsl:if>        
        </xsl:for-each>
        
        <xsl:for-each select="measurements">
            <xsl:if test="current()!='' or */@*!=''">
                <dt>
                    <xsl:text>Measurements: </xsl:text>
                </dt>
                <xsl:for-each select="measurementText">
                    <xsl:if test="current()!=''">
                        <dd><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each>            
                <xsl:for-each select="measurement">
                    <dd>
                        <xsl:if test="@type != ''">
                            <xsl:text>Type:</xsl:text><xsl:value-of select="@type"/>:
                        </xsl:if>
                        <xsl:text>  Value:</xsl:text><xsl:value-of select="@value"/>
                        <xsl:text> </xsl:text>
                        <xsl:text>  Units:</xsl:text><xsl:value-of select="@units"/>
                    </dd>
                </xsl:for-each>
                <xsl:for-each select="timePeriod">
                    <xsl:if test="@type != ''">
                        <dd>
                            <xsl:text>Measurement Time Period: </xsl:text>
                        </dd>
                    </xsl:if>
                    <xsl:call-template name="formatTime"/>
                </xsl:for-each>  
                
                <xsl:for-each select="accuracy">
                    <xsl:if test="current() != ''">
                        <dd><xsl:text>Measurement Accuracy:</xsl:text> </dd>
                        <dd><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each>  
                <xsl:for-each select="note">
                    <xsl:if test="current() != ''">
                        <dd><xsl:text>Measurement Note: </xsl:text></dd>
                         <dd><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each> 
              
            </xsl:if>        
        </xsl:for-each>
        
    </xsl:template>          

    
    <xsl:template name="formatTypeValueNote">
        <xsl:param name="text"/>
        <xsl:if test="@type!=''">
            <dt><xsl:value-of select="$text"/><xsl:text>: </xsl:text>
                <xsl:value-of select="@type"/>        </dt>
        </xsl:if>
        <xsl:if test="@class!=''">
        <dt><xsl:value-of select="$text"/><xsl:text>: </xsl:text>
                <xsl:value-of select="@class"/>
            </dt>
        </xsl:if>
        <xsl:for-each select="value">
             <xsl:if test="current() != ''">
                  <dd><xsl:value-of select="."/></dd>
             </xsl:if>
        </xsl:for-each>
        <xsl:for-each select="note">
             <xsl:if test="current() != ''">
                  <dd><xsl:text>Note: </xsl:text><xsl:value-of select="."/></dd>
             </xsl:if>
        </xsl:for-each>       
    </xsl:template>

    <xsl:template name="formatActor">
        <xsl:for-each select="persnameText">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>
        <xsl:for-each select="persname">
           <dd><xsl:call-template name="formatHumanName"/></dd>
        </xsl:for-each>
        <xsl:for-each select="taxonName">
            <dd><xsl:call-template name="formatTaxonName"/></dd>
        </xsl:for-each>
        <xsl:for-each select="corpname">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>       
    </xsl:template>
    

    <xsl:template name="formatTitle">
        <xsl:for-each select="titleText">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>
        <xsl:for-each select="persname">
            <xsl:if test="string-length(normalize-space(firstname)) or string-length(normalize-space(middlename)) or string-length(normalize-space(lastname))">            
                <dt><xsl:text>Full Name:  </xsl:text></dt>
            <dd><xsl:call-template name="formatHumanName"/></dd>
            </xsl:if>
            <xsl:for-each select="contactInfo"> 
                <xsl:call-template name="formatContactInfo"></xsl:call-template>
            </xsl:for-each>
        </xsl:for-each>
        <xsl:for-each select="taxonName">
            <xsl:call-template name="formatTaxonName"/>
        </xsl:for-each>
        <xsl:for-each select="corpname">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>        
    </xsl:template>
    
    <xsl:template name="formatContactInfo">
      
        <xsl:if test="@type">
            <dt>
            <xsl:text>Address Type:  </xsl:text><xsl:value-of select="@type"/>
            </dt>
        </xsl:if>
        <xsl:if test="address1">
            <dd>
            <xsl:text>Address1:  </xsl:text><xsl:value-of select="address1"/>
            </dd>
        </xsl:if>
        <xsl:if test="address2">
            <dd>
            <xsl:text>Address2:  </xsl:text><xsl:value-of select="address2"/>
            </dd>
        </xsl:if>
        <xsl:if test="city">
            <dd>
            <xsl:text>City:  </xsl:text><xsl:value-of select="city"/>
            </dd>
        </xsl:if>
        <xsl:if test="state">
            <dd>
            <xsl:text>State:  </xsl:text><xsl:value-of select="state"/>
            </dd>
        </xsl:if>
        <xsl:if test="postalCode">
            <dd>
            <xsl:text>Postal Code:  </xsl:text><xsl:value-of select="postalCode"/>
            </dd>
        </xsl:if>
        <xsl:if test="country">
            <dd>
            <xsl:text>Country:  </xsl:text><xsl:value-of select="country"/>
            </dd>
        </xsl:if>
        <xsl:for-each select="phone">     
            <xsl:if test="@type!=''">
                <dd>
                    <xsl:text>Phone Type: </xsl:text> <xsl:value-of select="@type"/>
                </dd>
                <dd>
                    <xsl:text>Phone Number: </xsl:text> <xsl:value-of select="."/>
                </dd>
            </xsl:if>
        </xsl:for-each>
        
        <xsl:for-each select="email">     
            <xsl:if test="@type!=''">
                <dd>
                    <xsl:text>Email Type: </xsl:text> <xsl:value-of select="@type"/>
                </dd>
            </xsl:if>
            <xsl:if test="current()!=''">
                <dd>
                    <xsl:text>Email Address: </xsl:text> <xsl:value-of select="."/>
                </dd>
            </xsl:if>
        </xsl:for-each>

    </xsl:template>
    
    <xsl:template name="formatTime">           
        <xsl:if test="@type != ''">
            <xsl:value-of select="@type"/>
        </xsl:if>
        
        <xsl:for-each select="intervalname">
            <xsl:if test="current() != ''">
                <dd><xsl:value-of select="."/></dd>
            </xsl:if>
        </xsl:for-each>
        
        <xsl:for-each select="date">
            <dd>
                <xsl:if test="@type!=''">
                    <xsl:value-of select="@type"/>:
                </xsl:if>
                <xsl:if test="year!= ''">
                    <xsl:value-of select="year"/>               
                </xsl:if>
                <xsl:if test="month!= ''">
                    <xsl:text>-</xsl:text><xsl:value-of select="month"/>            
                </xsl:if>
                <xsl:if test="day!= ''">
                    <xsl:text>-</xsl:text><xsl:value-of select="day"/>         
                </xsl:if>  
                <xsl:if test="time!= ''">
                    <xsl:text>  Time:</xsl:text><xsl:value-of select="time"/>         
                </xsl:if>  
            </dd>
        </xsl:for-each>
        <xsl:for-each select="note">
            <xsl:if test="current() != ''">
                <dd><xsl:text>Time Period Note: </xsl:text><xsl:value-of select="."/></dd>
            </xsl:if> 
        </xsl:for-each>      
    </xsl:template>
    
    <xsl:template name="formatPlace">
        <xsl:for-each select="geogname">
            <dd>
               <xsl:if test="@type!=''">
                   <xsl:value-of select="@type"/>: <xsl:value-of select="."/>
               </xsl:if>              
            </dd>
            
        </xsl:for-each>
        
        <xsl:for-each select="boundedby">
            <dd>
                <xsl:if test="(northlat!='' or westlong!='' or southlat!='' or eastlong!='')">
               
                <xsl:text>Bounding Box:</xsl:text>
                </xsl:if>
            </dd>
            <dd>
                <xsl:if test="northlat!=''">
                    <xsl:text>North Latitude: </xsl:text> 
                </xsl:if>
                <xsl:value-of select="northlat"/>
            </dd>
            <dd>
                <xsl:if test="westlong!=''">
                    <xsl:text>West Longitude: </xsl:text> 
                </xsl:if>
                <xsl:value-of select="westlong"/>
            </dd>
            <dd>
                <xsl:if test="southlat!=''">
                    <xsl:text>South Latitude: </xsl:text> 
                </xsl:if>
                <xsl:value-of select="southlat"/>
            </dd>
            <dd>
                <xsl:if test="eastlong!=''">
                    <xsl:text>East Longitude: </xsl:text> 
                </xsl:if>
                <xsl:value-of select="eastlong"/>
            </dd>
          
        </xsl:for-each>
        
        <xsl:for-each select="point">
            
                  <xsl:if test="lat!=''">
                    <dd>
                        <xsl:text>Latitude: </xsl:text> <xsl:value-of select="lat"/>
                    </dd>
                </xsl:if>

                <xsl:if test="long!=''">
                    <dd>
                        <xsl:text>Longitude: </xsl:text><xsl:value-of select="long"/> 
                    </dd>
                </xsl:if>
         
        </xsl:for-each>
       
        <xsl:for-each select="geometry">
            <dd><xsl:value-of select="."/></dd>
        </xsl:for-each>  
        
        <xsl:for-each select="timePeriod">
            <xsl:if test="@type != ''">
            <dd>
                <xsl:text>Place Time Period: </xsl:text>
            </dd>
            <xsl:call-template name="formatTime"></xsl:call-template>
            </xsl:if>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template name="formatHumanName">
    
        <xsl:if test="lastname">
            <xsl:value-of select="lastname"/><xsl:text>, </xsl:text>            
        </xsl:if>
        <xsl:if test="firstname">
            <xsl:value-of select="firstname"/><xsl:text> </xsl:text>            
        </xsl:if>
        <xsl:if test="middlename">
            <xsl:value-of select="middlename"/><xsl:text> </xsl:text>            
        </xsl:if>
        <xsl:if test="suffix">
            <xsl:value-of select="suffix"/><xsl:text> </xsl:text>            
        </xsl:if>
    </xsl:template>
    
    <xsl:template name="formatTaxonName">
        <dd><xsl:text>Genus: </xsl:text><xsl:value-of select="genus"/></dd>
        <dd><xsl:text>Species: </xsl:text><xsl:value-of select="species"/></dd>
        <xsl:if test="scientificNameAuthorship != ''">
            <dd><xsl:text>Scientific Name Authorship: </xsl:text><xsl:value-of select="scientificNameAuthorship"/></dd>
        </xsl:if>
        
        
                <xsl:if test="commonName">
                    <dd>
                    <xsl:text>Common Name: </xsl:text>
                    <xsl:for-each select="commonName">
                        <xsl:if test="current() != ''">
                            
                            <xsl:value-of select="."/>
                            <xsl:text>- </xsl:text>
                        </xsl:if> 
                    </xsl:for-each>  
                        </dd> 
                </xsl:if>
           
        
            <xsl:if test="kingdom != ''">
                <dd>
            <xsl:text> Kingdom: </xsl:text>
            <xsl:value-of select="kingdom"/> 
                </dd>
        </xsl:if>
        
        
            <xsl:if test="phylum != ''">
                <dd> 
                <xsl:text>  Phylum: </xsl:text>
                <xsl:value-of select="phylum"/> 
                </dd>
            </xsl:if>
         
        
            <xsl:if test="class != ''">
                <dd> 
                <xsl:text>   Class: </xsl:text>
                <xsl:value-of select="class"/> 
                </dd>
            </xsl:if>
        
       
            <xsl:if test="order != ''">
                <dd> 
                <xsl:text>    Order: </xsl:text>
                <xsl:value-of select="order"/> 
                </dd>
            </xsl:if>
        
        
            <xsl:if test="family != ''">
                <dd> 
                <xsl:text>     Family: </xsl:text>
                <xsl:value-of select="family"/> 
                </dd>
            </xsl:if>
        

               <xsl:for-each select="variant">
                   <xsl:if test="current() != ''">
                       <dd>
                       <xsl:text>      Variant Type: </xsl:text><xsl:value-of select="@type"/>
                       <xsl:text> - </xsl:text>
                       <xsl:value-of select="."/>
                       </dd>
                   </xsl:if> 
               </xsl:for-each>                    
                 
     
    </xsl:template>
    
    
</xsl:stylesheet>